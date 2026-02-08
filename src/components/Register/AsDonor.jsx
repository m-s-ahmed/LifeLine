import React, { useMemo, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";

export default function AsDonor() {
  const navigate = useNavigate();
  const { createUser, updateUserProfile, logout } = useContext(AuthContext);

  // 64 districts
  const districtsBD = useMemo(
    () => [
      "Dhaka",
      "Faridpur",
      "Gazipur",
      "Gopalganj",
      "Jamalpur",
      "Kishoreganj",
      "Madaripur",
      "Manikganj",
      "Munshiganj",
      "Mymensingh",
      "Narayanganj",
      "Narsingdi",
      "Netrokona",
      "Rajbari",
      "Shariatpur",
      "Sherpur",
      "Tangail",
      "Bogra",
      "Joypurhat",
      "Naogaon",
      "Natore",
      "Nawabganj",
      "Pabna",
      "Rajshahi",
      "Sirajgonj",
      "Dinajpur",
      "Gaibandha",
      "Kurigram",
      "Lalmonirhat",
      "Nilphamari",
      "Panchagarh",
      "Rangpur",
      "Thakurgaon",
      "Barguna",
      "Barisal",
      "Bhola",
      "Jhalokati",
      "Patuakhali",
      "Pirojpur",
      "Bandarban",
      "Brahmanbaria",
      "Chandpur",
      "Chittagong",
      "Comilla",
      "CoxsBazar",
      "Feni",
      "Khagrachari",
      "Lakshmipur",
      "Noakhali",
      "Rangamati",
      "Habiganj",
      "Maulvibazar",
      "Sunamganj",
      "Sylhet",
      "Bagerhat",
      "Chuadanga",
      "Jessore",
      "Jhenaidah",
      "Khulna",
      "Kushtia",
      "Magura",
      "Meherpur",
      "Narail",
      "Satkhira",
    ],
    [],
  );

  // 8 divisions
  const divisionsBD = useMemo(
    () => [
      "Rajshahi",
      "Dhaka",
      "Chattogram",
      "Khulna",
      "Rangpur",
      "Sylhet",
      "Barishal",
      "Mymensingh",
    ],
    [],
  );

  const monthOptions = useMemo(
    () => [
      { label: "Month", value: "" },
      { label: "Jan", value: "Jan" },
      { label: "Feb", value: "Feb" },
      { label: "Mar", value: "Mar" },
      { label: "Apr", value: "Apr" },
      { label: "May", value: "May" },
      { label: "Jun", value: "Jun" },
      { label: "Jul", value: "Jul" },
      { label: "Aug", value: "Aug" },
      { label: "Sep", value: "Sep" },
      { label: "Oct", value: "Oct" },
      { label: "Nov", value: "Nov" },
      { label: "Dec", value: "Dec" },
    ],
    [],
  );

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    age: "",
    bloodGroup: "",
    district: "",
    division: "",
    pinCode: "",
    lastDonationMonth: "",
    lastDonationYear: "",
    agree: false,
  });

  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "phone") {
      const v = value.replace(/[^\d+]/g, "");
      setForm((p) => ({ ...p, [name]: v }));
      return;
    }

    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  // ✅ Minimal + password validation
  const validate = () => {
    const e = {};

    if (!form.firstName.trim()) e.firstName = "First name required";
    if (!form.lastName.trim()) e.lastName = "Last name required";
    if (!form.phone.trim()) e.phone = "Phone required";
    if (!form.email.trim()) e.email = "Email required";

    if (!form.password) e.password = "Password required";
    else if (form.password.length < 6) e.password = "Minimum 6 characters";

    if (form.confirmPassword !== form.password)
      e.confirmPassword = "Passwords do not match";

    if (!form.agree) e.agree = "Please confirm";

    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errs = validate();
    setErrors(errs);

    if (Object.keys(errs).length) {
      setToast({ type: "error", message: "Fix the errors and submit again." });
      return;
    }

    try {
      setSubmitting(true);

      // ✅ 1) Create Firebase user
      const userCred = await createUser(form.email.trim(), form.password);

      // ✅ 2) Update profile name
      const fullName = `${form.firstName.trim()} ${form.lastName.trim()}`;
      await updateUserProfile(fullName, "");

      // ✅ 3) Get token (force refresh for production stability)
      const token = await userCred.user.getIdToken(true);

      // ✅ 4) Save donor data to MongoDB
      const donorPayload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(), // ✅ email add করলাম (ডিবিতে রাখলে সুবিধা)
        address: form.address.trim(),
        age: form.age ? Number(form.age) : null,
        bloodGroup: form.bloodGroup,
        district: form.district,
        division: form.division,
        pinCode: form.pinCode,
        lastDonationMonth: form.lastDonationMonth,
        lastDonationYear: form.lastDonationYear,
      };

      // 🔥 IMPORTANT: localhost না, env থেকে API URL
      const API = import.meta.env.VITE_API_URL;

      const res = await fetch(`${API}/api/donors/me`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(donorPayload),
      });

      // error details দেখার জন্য:
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.message || "MongoDB save failed");
      }

      setToast({
        type: "success",
        message: "Donor registered successfully ✅",
      });

      // ✅ 5) তুমি পরে login করবে — তাই logout করে login page
      setTimeout(async () => {
        try {
          await logout();
        } finally {
          navigate("/login", { state: { email: form.email.trim() } });
        }
      }, 800);
    } catch (err) {
      console.error(err);
      setToast({ type: "error", message: err.message || "Register failed" });
    } finally {
      setSubmitting(false);
    }
  };

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
              Register As Donor
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="px-4 py-8 md:px-10 md:py-10">
            <div className="space-y-5">
              {/* Name */}
              <Row label="Full Name">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <input
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      placeholder="First"
                      className={`input input-bordered w-full rounded-lg ${
                        errors.firstName ? "input-error" : ""
                      }`}
                    />
                    {errors.firstName && <Err>{errors.firstName}</Err>}
                  </div>

                  <div>
                    <input
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      placeholder="Last"
                      className={`input input-bordered w-full rounded-lg ${
                        errors.lastName ? "input-error" : ""
                      }`}
                    />
                    {errors.lastName && <Err>{errors.lastName}</Err>}
                  </div>
                </div>
              </Row>

              {/* Phone */}
              <Row label="Phone Number">
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Number"
                  className={`input input-bordered w-full rounded-lg ${
                    errors.phone ? "input-error" : ""
                  }`}
                />
                {errors.phone && <Err>{errors.phone}</Err>}
              </Row>

              {/* Email */}
              <Row label="Email">
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  type="email"
                  placeholder="Email"
                  className={`input input-bordered w-full rounded-lg ${
                    errors.email ? "input-error" : ""
                  }`}
                />
                {errors.email && <Err>{errors.email}</Err>}
              </Row>

              {/* Password */}
              <Row label="Password">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <input
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      type="password"
                      placeholder="Password"
                      className={`input input-bordered w-full rounded-lg ${
                        errors.password ? "input-error" : ""
                      }`}
                    />
                    {errors.password && <Err>{errors.password}</Err>}
                  </div>
                  <div>
                    <input
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      type="password"
                      placeholder="Confirm Password"
                      className={`input input-bordered w-full rounded-lg ${
                        errors.confirmPassword ? "input-error" : ""
                      }`}
                    />
                    {errors.confirmPassword && (
                      <Err>{errors.confirmPassword}</Err>
                    )}
                  </div>
                </div>
              </Row>

              {/* Address + Age + Blood Group + District + Division */}
              <Row label="Address" alignTop>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
                  <div className="md:col-span-7">
                    <textarea
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="Type Here (optional)"
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
                          placeholder="Age (optional)"
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
                            Division
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

              {/* Pin */}
              <Row label="PinCode">
                <input
                  name="pinCode"
                  value={form.pinCode}
                  onChange={handleChange}
                  placeholder="PinCode (optional)"
                  className="input input-bordered w-full rounded-lg"
                />
              </Row>

              {/* Last Donation */}
              <Row label="Last Donation">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <select
                    name="lastDonationMonth"
                    value={form.lastDonationMonth}
                    onChange={handleChange}
                    className="select select-bordered w-full rounded-lg"
                  >
                    {monthOptions.map((m) => (
                      <option
                        key={m.label}
                        value={m.value}
                        disabled={m.value === ""}
                      >
                        {m.label}
                      </option>
                    ))}
                  </select>

                  <input
                    name="lastDonationYear"
                    value={form.lastDonationYear}
                    onChange={handleChange}
                    placeholder="Year (optional)"
                    className="input input-bordered w-full rounded-lg"
                  />
                </div>
              </Row>

              {/* Agree */}
              <div className="grid grid-cols-1 gap-2 md:grid-cols-12 items-center">
                <div className="md:col-span-3" />
                <div className="md:col-span-9">
                  <label className="label cursor-pointer justify-start gap-3">
                    <input
                      type="checkbox"
                      name="agree"
                      checked={form.agree}
                      onChange={handleChange}
                      className={`checkbox checkbox-sm ${
                        errors.agree ? "checkbox-error" : ""
                      }`}
                    />
                    <span className="label-text text-sm text-base-content/60 italic">
                      I confirm the information is correct and I am willing to
                      donate blood.
                    </span>
                  </label>
                  {errors.agree && <Err>{errors.agree}</Err>}
                </div>
              </div>

              {/* Submit */}
              <div className="grid grid-cols-1 md:grid-cols-12">
                <div className="md:col-span-3" />
                <div className="md:col-span-9 flex justify-end">
                  <button
                    type="submit"
                    className="btn btn-neutral rounded-md px-8"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Creating...
                      </>
                    ) : (
                      "Submit"
                    )}
                  </button>
                </div>
              </div>

              <p className="text-sm text-center text-base-content/60 pt-2">
                Already have an account?{" "}
                <span
                  className="link link-hover font-semibold"
                  onClick={() => navigate("/login")}
                >
                  Login
                </span>
              </p>
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

function Err({ children }) {
  return <p className="mt-1 text-xs text-error">{children}</p>;
}
