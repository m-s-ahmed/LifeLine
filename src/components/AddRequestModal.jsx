import React, { useEffect, useMemo, useRef, useState } from "react";
import { axiosSecure } from "../api/axiosSecure";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

// Optional: keep small validation helpers
const isEmail = (v = "") => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim());

export default function AddRequestModal({ open, onClose, me, onCreated }) {
  const initialForm = useMemo(
    () => ({
      bloodGroup: "",
      division: "",
      district: "",
      hospitalName: "",
      hospitalAddress: "",
      patientName: "",
      relation: "",
      units: 1,
      neededDate: "",
      neededTime: "",
      reason: "",
      note: "",
    }),
    [],
  );

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [topError, setTopError] = useState("");
  const [loading, setLoading] = useState(false);

  const bodyRef = useRef(null);

  // refs for focusing invalid fields
  const refs = {
    bloodGroup: useRef(null),
    units: useRef(null),
    district: useRef(null),
    hospitalName: useRef(null),
    hospitalAddress: useRef(null),
    neededDate: useRef(null),
    neededTime: useRef(null),
    patientName: useRef(null),
    relation: useRef(null),
    reason: useRef(null),
    note: useRef(null),
    division: useRef(null),
  };

  // ✅ Lock background scroll + Reset modal state on open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // reset every time open
    setForm(initialForm);
    setErrors({});
    setTopError("");
    setLoading(false);

    return () => {
      document.body.style.overflow = prev;
    };
  }, [open, initialForm]);

  if (!open) return null;

  const onChange = (e) => {
    const { name, value, type } = e.target;

    setTopError("");
    setErrors((p) => ({ ...p, [name]: "" }));

    setForm((p) => ({
      ...p,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const todayISO = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.toISOString().slice(0, 10);
  };

  const validate = () => {
    const e = {};

    // required
    if (!form.bloodGroup) e.bloodGroup = "Please select blood group.";
    if (!String(form.district).trim()) e.district = "District is required.";
    if (String(form.district).trim().length < 2)
      e.district = "District looks too short.";
    if (!String(form.hospitalName).trim())
      e.hospitalName = "Hospital name is required.";
    if (String(form.hospitalName).trim().length < 3)
      e.hospitalName = "Hospital name must be at least 3 characters.";

    // units validation
    const units = Number(form.units || 0);
    if (!units || units < 1) e.units = "Units must be at least 1.";
    if (units > 10) e.units = "Units seems too high (max 10).";

    // date validation
    if (!form.neededDate) e.neededDate = "Needed date is required.";
    if (form.neededDate && form.neededDate < todayISO())
      e.neededDate = "Needed date cannot be in the past.";

    // optional but quality validations
    if (form.hospitalAddress && String(form.hospitalAddress).trim().length < 5)
      e.hospitalAddress = "Address should be at least 5 characters.";

    if (form.patientName && String(form.patientName).trim().length < 2)
      e.patientName = "Patient name looks too short.";

    if (form.relation && String(form.relation).trim().length < 2)
      e.relation = "Relation looks too short.";

    if (form.reason && String(form.reason).trim().length < 3)
      e.reason = "Reason should be at least 3 characters.";

    if (form.note && String(form.note).trim().length > 500)
      e.note = "Note should be within 500 characters.";

    // (optional) requester email check if you want:
    if (me?.email && !isEmail(me.email)) {
      // won't block, but could warn—here we block to be safe
      e._me = "Your profile email seems invalid. Please re-login.";
    }

    return e;
  };

  const focusFirstError = (eObj) => {
    const order = [
      "bloodGroup",
      "units",
      "division",
      "district",
      "hospitalName",
      "hospitalAddress",
      "neededDate",
      "neededTime",
      "patientName",
      "relation",
      "reason",
      "note",
      "_me",
    ];

    const firstKey = order.find((k) => eObj[k]);
    if (!firstKey) return;

    // Scroll body to top a bit so header stays visible
    if (bodyRef.current)
      bodyRef.current.scrollTo({ top: 0, behavior: "smooth" });

    // focus the field (if exists)
    const r = refs[firstKey]?.current;
    if (r && typeof r.focus === "function") {
      setTimeout(() => r.focus(), 80);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setTopError("");

    const eObj = validate();
    setErrors(eObj);

    if (Object.keys(eObj).length) {
      setTopError("Please fix the highlighted fields and submit again.");
      focusFirstError(eObj);
      return;
    }

    try {
      setLoading(true);

      const payload = {
        ...form,
        units: Number(form.units || 1),
        requesterName: me?.name || "",
        requesterEmail: me?.email || "",
        requesterPhone: me?.phone || "",
      };

      const res = await axiosSecure.post("/api/requests", payload);

      onCreated?.(res.data?.request);
      onClose();
    } catch (e2) {
      setTopError(e2?.response?.data?.message || "Create failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="min-h-screen w-full px-3 py-4 sm:px-6 sm:py-8 flex items-center justify-center">
        {/* ✅ Grid layout keeps footer ALWAYS visible */}
        <div className="w-full max-w-2xl rounded-2xl bg-base-100 shadow-2xl overflow-hidden border border-base-200 grid grid-rows-[auto,1fr,auto]">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#4b0c2a] via-[#7a0f3a] to-[#c21d4b] px-4 sm:px-6 py-4 text-white">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-base sm:text-lg">
                  Add Blood Request
                </h3>
                <p className="text-white/80 text-xs sm:text-sm mt-1">
                  জরুরি তথ্যগুলো সঠিকভাবে দিলে ডোনারকে রিকুয়েস্ট পাঠানো সহজ হবে।
                </p>
              </div>

              <button
                type="button"
                className="btn btn-sm btn-ghost text-white"
                onClick={onClose}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Body (scrollable) */}
          <form onSubmit={submit} className="contents">
            <div
              ref={bodyRef}
              className="px-4 sm:px-6 py-4 overflow-y-auto max-h-[72vh]"
            >
              {/* ✅ Error stays visible but doesn't break footer */}
              {(topError || errors._me) && (
                <div className="sticky top-0 z-10 pb-3 bg-base-100">
                  <div className="alert alert-error rounded-xl">
                    <span className="text-sm">{errors._me || topError}</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Blood Group */}
                <div>
                  <label className="label">
                    <span className="label-text font-semibold">
                      Blood Group*
                    </span>
                  </label>
                  <select
                    ref={refs.bloodGroup}
                    className={`select select-bordered w-full ${
                      errors.bloodGroup ? "select-error" : ""
                    }`}
                    name="bloodGroup"
                    value={form.bloodGroup}
                    onChange={onChange}
                  >
                    <option value="" disabled>
                      Select
                    </option>
                    {BLOOD_GROUPS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                  {errors.bloodGroup && (
                    <p className="mt-1 text-xs text-error">
                      {errors.bloodGroup}
                    </p>
                  )}
                </div>

                {/* Units */}
                <div>
                  <label className="label">
                    <span className="label-text font-semibold">Units*</span>
                  </label>
                  <input
                    ref={refs.units}
                    className={`input input-bordered w-full ${
                      errors.units ? "input-error" : ""
                    }`}
                    type="number"
                    min="1"
                    max="10"
                    name="units"
                    value={form.units}
                    onChange={onChange}
                  />
                  {errors.units && (
                    <p className="mt-1 text-xs text-error">{errors.units}</p>
                  )}
                </div>

                {/* Division */}
                <div>
                  <label className="label">
                    <span className="label-text font-semibold">Division</span>
                  </label>
                  <input
                    ref={refs.division}
                    className="input input-bordered w-full"
                    name="division"
                    value={form.division}
                    onChange={onChange}
                    placeholder="Rajshahi / Dhaka..."
                  />
                </div>

                {/* District */}
                <div>
                  <label className="label">
                    <span className="label-text font-semibold">District*</span>
                  </label>
                  <input
                    ref={refs.district}
                    className={`input input-bordered w-full ${
                      errors.district ? "input-error" : ""
                    }`}
                    name="district"
                    value={form.district}
                    onChange={onChange}
                    placeholder="Rajshahi..."
                  />
                  {errors.district && (
                    <p className="mt-1 text-xs text-error">{errors.district}</p>
                  )}
                </div>

                {/* Hospital Name */}
                <div className="sm:col-span-2">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Hospital Name*
                    </span>
                  </label>
                  <input
                    ref={refs.hospitalName}
                    className={`input input-bordered w-full ${
                      errors.hospitalName ? "input-error" : ""
                    }`}
                    name="hospitalName"
                    value={form.hospitalName}
                    onChange={onChange}
                    placeholder="Hospital / Clinic name"
                  />
                  {errors.hospitalName && (
                    <p className="mt-1 text-xs text-error">
                      {errors.hospitalName}
                    </p>
                  )}
                </div>

                {/* Hospital Address */}
                <div className="sm:col-span-2">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Hospital Address
                    </span>
                  </label>
                  <input
                    ref={refs.hospitalAddress}
                    className={`input input-bordered w-full ${
                      errors.hospitalAddress ? "input-error" : ""
                    }`}
                    name="hospitalAddress"
                    value={form.hospitalAddress}
                    onChange={onChange}
                    placeholder="Full address (optional)"
                  />
                  {errors.hospitalAddress && (
                    <p className="mt-1 text-xs text-error">
                      {errors.hospitalAddress}
                    </p>
                  )}
                </div>

                {/* Needed Date */}
                <div>
                  <label className="label">
                    <span className="label-text font-semibold">
                      Needed Date*
                    </span>
                  </label>
                  <input
                    ref={refs.neededDate}
                    className={`input input-bordered w-full ${
                      errors.neededDate ? "input-error" : ""
                    }`}
                    type="date"
                    name="neededDate"
                    value={form.neededDate}
                    onChange={onChange}
                    min={todayISO()}
                  />
                  {errors.neededDate && (
                    <p className="mt-1 text-xs text-error">
                      {errors.neededDate}
                    </p>
                  )}
                </div>

                {/* Needed Time */}
                <div>
                  <label className="label">
                    <span className="label-text font-semibold">
                      Needed Time
                    </span>
                  </label>
                  <input
                    ref={refs.neededTime}
                    className="input input-bordered w-full"
                    type="time"
                    name="neededTime"
                    value={form.neededTime}
                    onChange={onChange}
                  />
                </div>

                {/* Patient Name */}
                <div>
                  <label className="label">
                    <span className="label-text font-semibold">
                      Patient Name
                    </span>
                  </label>
                  <input
                    ref={refs.patientName}
                    className={`input input-bordered w-full ${
                      errors.patientName ? "input-error" : ""
                    }`}
                    name="patientName"
                    value={form.patientName}
                    onChange={onChange}
                    placeholder="Optional"
                  />
                  {errors.patientName && (
                    <p className="mt-1 text-xs text-error">
                      {errors.patientName}
                    </p>
                  )}
                </div>

                {/* Relation */}
                <div>
                  <label className="label">
                    <span className="label-text font-semibold">Relation</span>
                  </label>
                  <input
                    ref={refs.relation}
                    className={`input input-bordered w-full ${
                      errors.relation ? "input-error" : ""
                    }`}
                    name="relation"
                    value={form.relation}
                    onChange={onChange}
                    placeholder="Brother / Friend..."
                  />
                  {errors.relation && (
                    <p className="mt-1 text-xs text-error">{errors.relation}</p>
                  )}
                </div>

                {/* Reason */}
                <div className="sm:col-span-2">
                  <label className="label">
                    <span className="label-text font-semibold">Reason</span>
                  </label>
                  <input
                    ref={refs.reason}
                    className={`input input-bordered w-full ${
                      errors.reason ? "input-error" : ""
                    }`}
                    name="reason"
                    value={form.reason}
                    onChange={onChange}
                    placeholder="Accident / Surgery / Anemia..."
                  />
                  {errors.reason && (
                    <p className="mt-1 text-xs text-error">{errors.reason}</p>
                  )}
                </div>

                {/* Note */}
                <div className="sm:col-span-2">
                  <label className="label">
                    <span className="label-text font-semibold">Note</span>
                    <span className="label-text-alt text-base-content/60">
                      {String(form.note || "").length}/500
                    </span>
                  </label>
                  <textarea
                    ref={refs.note}
                    className={`textarea textarea-bordered w-full min-h-[96px] ${
                      errors.note ? "textarea-error" : ""
                    }`}
                    name="note"
                    value={form.note}
                    onChange={onChange}
                    placeholder="Any extra instruction..."
                    maxLength={500}
                  />
                  {errors.note && (
                    <p className="mt-1 text-xs text-error">{errors.note}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Footer (always visible; never “disappears”) */}
            <div className="px-4 sm:px-6 py-4 border-t border-base-200 bg-base-100 flex flex-col sm:flex-row gap-2 sm:justify-end">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>

              <button className="btn btn-neutral" disabled={loading}>
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm" />
                    Creating...
                  </>
                ) : (
                  "Create Request"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
