import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosSecure } from "../../api/axiosSecure";

export default function EditProfile() {
  const navigate = useNavigate();

  const districtsBD = useMemo(
    () => ["Rajshahi", "Dhaka", "Chattogram", "Khulna", "Rangpur", "Sylhet"],
    [],
  );
  const divisionsBD = useMemo(
    () => ["Rajshahi", "Dhaka", "Chattogram", "Khulna", "Rangpur", "Sylhet"],
    [],
  );
  const monthOptions = useMemo(
    () => [
      "",
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    [],
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    age: "",
    bloodGroup: "",
    district: "",
    division: "",
    pinCode: "",
    lastDonationMonth: "",
    lastDonationYear: "",
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get("/api/donors/me");
        const d = res.data || {};
        if (!mounted) return;

        setForm((p) => ({
          ...p,
          firstName: d.firstName || "",
          lastName: d.lastName || "",
          phone: d.phone || "",
          email: d.email || "",
          address: d.address || "",
          age: d.age ?? "",
          bloodGroup: d.bloodGroup || "",
          district: d.district || "",
          division: d.division || "",
          pinCode: d.pinCode || "",
          lastDonationMonth: d.lastDonationMonth || "",
          lastDonationYear: d.lastDonationYear || "",
        }));
      } catch (e) {
        console.log(e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => (mounted = false);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);

      // ✅ email/uid backend token থেকে enforce হবে; তবুও payload পাঠাতে সমস্যা নেই
      const payload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        age: form.age ? Number(form.age) : null,
        bloodGroup: form.bloodGroup,
        district: form.district,
        division: form.division,
        pinCode: form.pinCode,
        lastDonationMonth: form.lastDonationMonth,
        lastDonationYear: form.lastDonationYear,
      };

      await axiosSecure.put("/api/donors/me", payload);
      setToast({ type: "success", message: "Profile updated ✅" });
      setTimeout(() => navigate("/my-profile"), 900);
    } catch (e2) {
      console.log(e2);
      setToast({ type: "error", message: "Update failed" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  return (
    <section className="w-full bg-base-200/40 py-10 md:py-14">
      {toast && (
        <div className="toast toast-top toast-end z-50">
          <div
            className={`alert ${
              toast.type === "success" ? "alert-success" : "alert-error"
            } shadow-lg`}
          >
            <span className="text-sm font-semibold">{toast.message}</span>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-5xl px-4">
        <div className="overflow-hidden rounded-2xl bg-base-100 shadow-xl border border-base-200">
          <div className="bg-gradient-to-r from-[#4b0c2a] via-[#7a0f3a] to-[#c21d4b] px-6 py-5 md:px-10 md:py-6">
            <h1 className="text-lg md:text-xl font-extrabold text-white">
              Edit Profile
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="px-4 py-8 md:px-10 md:py-10">
            <div className="space-y-5">
              <Row label="Full Name">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <input
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="First"
                    className="input input-bordered w-full rounded-lg"
                  />
                  <input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Last"
                    className="input input-bordered w-full rounded-lg"
                  />
                </div>
              </Row>

              <Row label="Phone Number">
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Number"
                  className="input input-bordered w-full rounded-lg"
                />
              </Row>

              <Row label="Email">
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Mail Id"
                  className="input input-bordered w-full rounded-lg"
                  disabled
                />
              </Row>

              <Row label="Address" alignTop>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
                  <div className="md:col-span-7">
                    <textarea
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="Type Here"
                      className="textarea textarea-bordered w-full rounded-lg min-h-[110px]"
                    />
                  </div>

                  <div className="md:col-span-5">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <input
                          name="age"
                          value={form.age}
                          onChange={handleChange}
                          type="number"
                          placeholder="Age"
                          className="input input-bordered w-full rounded-lg"
                        />
                        <select
                          name="bloodGroup"
                          value={form.bloodGroup}
                          onChange={handleChange}
                          className="select select-bordered w-full rounded-lg"
                        >
                          <option value="" disabled>
                            Blood Group
                          </option>
                          {[
                            "A+",
                            "A-",
                            "B+",
                            "B-",
                            "O+",
                            "O-",
                            "AB+",
                            "AB-",
                          ].map((bg) => (
                            <option key={bg} value={bg}>
                              {bg}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <select
                          name="district"
                          value={form.district}
                          onChange={handleChange}
                          className="select select-bordered w-full rounded-lg"
                        >
                          <option value="" disabled>
                            District
                          </option>
                          {districtsBD.map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>

                        <select
                          name="division"
                          value={form.division}
                          onChange={handleChange}
                          className="select select-bordered w-full rounded-lg"
                        >
                          <option value="" disabled>
                            State
                          </option>
                          {divisionsBD.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </Row>

              <Row label="PinCode">
                <input
                  name="pinCode"
                  value={form.pinCode}
                  onChange={handleChange}
                  placeholder="PinCode"
                  className="input input-bordered w-full rounded-lg"
                />
              </Row>

              <Row label="Last Donation">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <select
                    name="lastDonationMonth"
                    value={form.lastDonationMonth}
                    onChange={handleChange}
                    className="select select-bordered w-full rounded-lg"
                  >
                    <option value="" disabled>
                      Month
                    </option>
                    {monthOptions
                      .filter((m) => m !== "")
                      .map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                  </select>

                  <input
                    name="lastDonationYear"
                    value={form.lastDonationYear}
                    onChange={handleChange}
                    placeholder="Year"
                    className="input input-bordered w-full rounded-lg"
                  />
                </div>
              </Row>

              <div className="grid grid-cols-1 md:grid-cols-12">
                <div className="md:col-span-3" />
                <div className="md:col-span-9 flex justify-end">
                  <button
                    className="btn btn-neutral rounded-md px-8"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <span className="loading loading-spinner loading-sm" />
                        Saving...
                      </>
                    ) : (
                      "Submit"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

function Row({ label, children, alignTop = false }) {
  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-12 md:gap-6">
      <div className={`md:col-span-3 ${alignTop ? "md:pt-2" : "md:pt-3"}`}>
        <p className="text-sm font-semibold text-base-content/60 md:text-right">
          {label}
        </p>
      </div>
      <div className="md:col-span-9">{children}</div>
    </div>
  );
}
