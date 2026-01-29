import React, { useEffect, useMemo, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";
import { axiosSecure } from "../../api/axiosSecure";

const getInitials = (nameOrEmail = "") => {
  const s = (nameOrEmail || "").trim();
  if (!s) return "U";
  const parts = s.split(" ").filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return s.slice(0, 2).toUpperCase();
};

const pad2 = (n) => String(n).padStart(2, "0");

// "YYYY-MM-DD"
const toYMD = (d) =>
  `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

export default function MyProfile() {
  const { user } = useContext(AuthContext);

  const [profile, setProfile] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add Donation modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savingDonation, setSavingDonation] = useState(false);
  const [toast, setToast] = useState(null);
  const [donationForm, setDonationForm] = useState({
    date: toYMD(new Date()),
    units: 1,
    place: "",
    note: "",
  });

  // Calendar state
  const [cal, setCal] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() }; // month: 0-11
  });

  const initials = useMemo(
    () => getInitials(user?.displayName || user?.email),
    [user],
  );

  // toast auto hide
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  // Fetch profile + donations
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        const [profileRes, donationRes] = await Promise.all([
          axiosSecure.get("/api/donors/me"),
          axiosSecure.get("/api/donations/me"),
        ]);

        if (mounted) {
          setProfile(profileRes.data);
          setDonations(donationRes.data || []);
        }
      } catch (e) {
        console.log(e);
        if (mounted) {
          setProfile(null);
          setDonations([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => (mounted = false);
  }, []);

  // Donation days set => highlight in calendar
  const donationDateSet = useMemo(() => {
    const s = new Set();
    donations.forEach((d) => {
      const dt = new Date(d.date);
      s.add(toYMD(dt));
    });
    return s;
  }, [donations]);

  // Profile full name
  const fullName =
    profile?.firstName || profile?.lastName
      ? `${profile?.firstName || ""} ${profile?.lastName || ""}`.trim()
      : user?.displayName || "User";

  // Calendar helpers
  const monthLabel = useMemo(() => {
    const d = new Date(cal.year, cal.month, 1);
    return d.toLocaleString(undefined, { month: "long", year: "numeric" });
  }, [cal]);

  const calendarCells = useMemo(() => {
    // create 6 weeks grid => 42 cells
    const first = new Date(cal.year, cal.month, 1);
    const startDay = (first.getDay() + 6) % 7; // convert Sunday=0 to Monday=0
    const daysInMonth = new Date(cal.year, cal.month + 1, 0).getDate();

    const cells = [];
    for (let i = 0; i < 42; i++) {
      const dayNum = i - startDay + 1; // 1..daysInMonth
      if (dayNum < 1 || dayNum > daysInMonth) {
        cells.push(null);
      } else {
        cells.push(dayNum);
      }
    }
    return cells;
  }, [cal]);

  const goPrevMonth = () => {
    setCal((p) => {
      const m = p.month - 1;
      if (m < 0) return { year: p.year - 1, month: 11 };
      return { year: p.year, month: m };
    });
  };

  const goNextMonth = () => {
    setCal((p) => {
      const m = p.month + 1;
      if (m > 11) return { year: p.year + 1, month: 0 };
      return { year: p.year, month: m };
    });
  };

  // Modal handlers
  const openModal = () => {
    setDonationForm({
      date: toYMD(new Date()),
      units: 1,
      place: "",
      note: "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleDonationChange = (e) => {
    const { name, value } = e.target;
    setDonationForm((p) => ({
      ...p,
      [name]: name === "units" ? value.replace(/[^\d]/g, "") : value,
    }));
  };

  const submitDonation = async (e) => {
    e.preventDefault();
    try {
      setSavingDonation(true);

      if (!donationForm.date) {
        setToast({ type: "error", message: "Please select a date" });
        return;
      }

      const payload = {
        date: donationForm.date,
        units: Number(donationForm.units || 1),
        place: donationForm.place.trim(),
        note: donationForm.note.trim(),
      };

      const res = await axiosSecure.post("/api/donations", payload);

      // ✅ update UI instantly
      setDonations((prev) => [res.data, ...prev]);

      setToast({ type: "success", message: "Donation added ✅" });
      setIsModalOpen(false);
    } catch (err) {
      console.log(err);
      setToast({
        type: "error",
        message: err?.response?.data?.message || "Failed to add donation",
      });
    } finally {
      setSavingDonation(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  const todayYMD = toYMD(new Date());

  return (
    <section className="w-full bg-base-200/40 py-10 md:py-12">
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

      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left big card */}
          <div className="lg:col-span-8">
            <div className="rounded-3xl bg-base-100 border border-base-200 shadow-xl overflow-hidden">
              {/* Header */}
              <div className="p-6 md:p-7 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="avatar placeholder">
                    <div className="w-16 rounded-2xl bg-neutral text-neutral-content">
                      <span className="text-lg font-extrabold">{initials}</span>
                    </div>
                  </div>

                  <div className="min-w-0">
                    <h1 className="text-2xl md:text-3xl font-extrabold truncate">
                      {fullName}
                    </h1>
                    <p className="text-sm text-base-content/60 truncate">
                      {profile?.bloodGroup
                        ? `${profile.bloodGroup} Donor`
                        : "Donor Profile"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="btn btn-ghost btn-sm rounded-full">
                    🔔
                  </button>

                  {/* ✅ Add Donation */}
                  <button
                    onClick={openModal}
                    className="btn btn-outline btn-sm rounded-xl px-4"
                  >
                    + Add Donation
                  </button>

                  <Link
                    to="/edit-profile"
                    className="btn btn-neutral btn-sm rounded-xl px-5"
                  >
                    Edit Profile
                  </Link>
                </div>
              </div>

              {/* About table */}
              <div className="px-4 md:px-7 pb-7">
                <div className="rounded-2xl border border-base-200 overflow-hidden">
                  <div className="bg-base-200/50 px-5 py-3">
                    <p className="font-bold">About</p>
                  </div>

                  <div className="divide-y divide-base-200">
                    <InfoRow label="Full Name" value={fullName} />
                    <InfoRow
                      label="Email"
                      value={profile?.email || user?.email || "-"}
                    />
                    <InfoRow
                      label="District"
                      value={profile?.district || "-"}
                    />
                    <InfoRow
                      label="Phone Number"
                      value={profile?.phone || "-"}
                    />
                    <InfoRow label="PinCode" value={profile?.pinCode || "-"} />
                    <InfoRow label="Age" value={profile?.age ?? "-"} />
                    <InfoRow
                      label="Blood Group"
                      value={profile?.bloodGroup || "-"}
                    />
                    <InfoRow label="Address" value={profile?.address || "-"} />
                    <InfoRow
                      label="Last Donation"
                      value={
                        profile?.lastDonationMonth || profile?.lastDonationYear
                          ? `${profile?.lastDonationMonth || ""} ${profile?.lastDonationYear || ""}`.trim()
                          : "-"
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* ✅ Donation History (real) */}
            <div className="rounded-3xl bg-base-100 border border-base-200 shadow-xl p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold">Donation History</h3>
                <button
                  className="btn btn-ghost btn-xs"
                  onClick={openModal}
                  title="Add donation"
                >
                  + Add
                </button>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th className="text-right">Units</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donations.length ? (
                      donations.slice(0, 6).map((d) => (
                        <tr key={d._id}>
                          <td>{new Date(d.date).toLocaleDateString()}</td>
                          <td className="text-right">{d.units}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={2}
                          className="text-center text-base-content/60"
                        >
                          No donation history yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* small hint */}
              <p className="mt-3 text-xs text-base-content/60">
                Tip: Use “Add Donation” to update your history.
              </p>
            </div>

            {/* ✅ Real Calendar (current month) */}
            <div className="rounded-3xl bg-base-100 border border-base-200 shadow-xl p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold">{monthLabel}</h3>
                <div className="flex gap-2">
                  <button
                    className="btn btn-ghost btn-xs"
                    onClick={goPrevMonth}
                  >
                    ‹
                  </button>
                  <button
                    className="btn btn-ghost btn-xs"
                    onClick={goNextMonth}
                  >
                    ›
                  </button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-7 gap-2 text-center text-sm">
                {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
                  <div key={d} className="font-semibold text-base-content/60">
                    {d}
                  </div>
                ))}

                {calendarCells.map((day, idx) => {
                  if (!day) return <div key={idx} />;

                  const cellDate = new Date(cal.year, cal.month, day);
                  const key = toYMD(cellDate);

                  const isToday = key === todayYMD;
                  const hasDonation = donationDateSet.has(key);

                  const cls = [
                    "rounded-lg py-2 select-none",
                    hasDonation
                      ? "bg-primary text-primary-content font-bold"
                      : "bg-base-200/40",
                    isToday
                      ? "ring-2 ring-primary ring-offset-2 ring-offset-base-100"
                      : "",
                  ].join(" ");

                  return (
                    <div
                      key={idx}
                      className={cls}
                      title={
                        hasDonation ? "Donation day" : isToday ? "Today" : ""
                      }
                    >
                      {day}
                    </div>
                  );
                })}
              </div>

              <div className="mt-3 flex items-center gap-2 text-xs text-base-content/60">
                <span className="inline-block h-3 w-3 rounded bg-primary" />
                <span>Donation day</span>
                <span className="ml-3 inline-block h-3 w-3 rounded bg-base-200/40 ring-2 ring-primary ring-offset-2 ring-offset-base-100" />
                <span>Today</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Add Donation Modal */}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box rounded-2xl">
            <h3 className="font-extrabold text-lg">Add Donation</h3>
            <p className="text-sm text-base-content/60 mt-1">
              Add your donation record. It will appear in Donation History and
              calendar.
            </p>

            <form onSubmit={submitDonation} className="mt-5 space-y-4">
              <div>
                <label className="label">
                  <span className="label-text font-semibold">
                    Donation Date
                  </span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={donationForm.date}
                  onChange={handleDonationChange}
                  className="input input-bordered w-full rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">
                    <span className="label-text font-semibold">Units</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    name="units"
                    value={donationForm.units}
                    onChange={handleDonationChange}
                    className="input input-bordered w-full rounded-xl"
                  />
                </div>

                <div>
                  <label className="label">
                    <span className="label-text font-semibold">
                      Place (optional)
                    </span>
                  </label>
                  <input
                    type="text"
                    name="place"
                    value={donationForm.place}
                    onChange={handleDonationChange}
                    placeholder="e.g., Rajshahi"
                    className="input input-bordered w-full rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="label">
                  <span className="label-text font-semibold">
                    Note (optional)
                  </span>
                </label>
                <textarea
                  name="note"
                  value={donationForm.note}
                  onChange={handleDonationChange}
                  className="textarea textarea-bordered w-full rounded-xl"
                  placeholder="Any details..."
                />
              </div>

              <div className="modal-action">
                <button
                  type="button"
                  className="btn btn-ghost rounded-xl"
                  onClick={closeModal}
                  disabled={savingDonation}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-neutral rounded-xl"
                  disabled={savingDonation}
                >
                  {savingDonation ? (
                    <>
                      <span className="loading loading-spinner loading-sm" />
                      Saving...
                    </>
                  ) : (
                    "Save"
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* click outside to close */}
          <div className="modal-backdrop" onClick={closeModal} />
        </div>
      )}
    </section>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="grid grid-cols-12 gap-3 px-5 py-3">
      <div className="col-span-4 text-sm text-base-content/60 font-semibold">
        {label}
      </div>
      <div className="col-span-8 text-sm font-medium break-words">{value}</div>
    </div>
  );
}
