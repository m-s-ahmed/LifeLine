import React, { useMemo, useState } from "react";
import { axiosSecure } from "../../api/axiosSecure";

// ✅ Division list (BD)
const DIVISIONS = [
  "Dhaka",
  "Chattogram",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Sylhet",
  "Rangpur",
  "Mymensingh",
];

// ✅ Districts (simple starter set — পরে চাইলে full list add করবে)
const DISTRICTS_BY_DIVISION = {
  Dhaka: ["Dhaka", "Gazipur", "Narayanganj", "Tangail", "Manikganj"],
  Chattogram: ["Chattogram", "Cox's Bazar", "Cumilla", "Noakhali", "Feni"],
  Rajshahi: ["Rajshahi", "Natore", "Naogaon", "Chapainawabganj", "Pabna"],
  Khulna: ["Khulna", "Jashore", "Satkhira", "Kushtia", "Jhenaidah"],
  Barishal: ["Barishal", "Patuakhali", "Bhola", "Jhalokathi", "Pirojpur"],
  Sylhet: ["Sylhet", "Moulvibazar", "Habiganj", "Sunamganj"],
  Rangpur: ["Rangpur", "Dinajpur", "Kurigram", "Gaibandha", "Nilphamari"],
  Mymensingh: ["Mymensingh", "Jamalpur", "Netrokona", "Sherpur"],
};

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

// Month mapping (তোমার DB তে "Jan" টাইপ আছে)
const MONTH_INDEX = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
};

export default function FindBlood() {
  const [bloodGroup, setBloodGroup] = useState("");
  const [division, setDivision] = useState("");
  const [district, setDistrict] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);

  const [loading, setLoading] = useState(false);
  const [donors, setDonors] = useState([]);
  const [msg, setMsg] = useState("");

  const districtOptions = useMemo(
    () => (division ? DISTRICTS_BY_DIVISION[division] || [] : []),
    [division],
  );

  const handleDivisionChange = (e) => {
    const v = e.target.value;
    setDivision(v);
    setDistrict(""); // ✅ division change হলে district reset
  };

  const buildLastDonationDate = (d) => {
    // Prefer explicit ISO date if you ever add later:
    if (d.lastDonationDate) return d.lastDonationDate;

    // Build from month/year (current DB structure)
    const m = d.lastDonationMonth;
    const y = d.lastDonationYear;

    if (!m || !y) return null;
    const mi = MONTH_INDEX[m];
    const yi = Number(y);
    if (mi === undefined || Number.isNaN(yi)) return null;

    // Assume 1st day of month
    const dt = new Date(yi, mi, 1);
    return dt.toISOString();
  };

  const formatDate = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Availability rule: last donation >= 90 days => available
  const getAvailability = (lastDonationISO) => {
    if (!lastDonationISO) return { label: "Unknown", cls: "badge-ghost" };

    const diffDays = Math.floor(
      (Date.now() - new Date(lastDonationISO)) / (1000 * 60 * 60 * 24),
    );

    if (diffDays < 0) return { label: "Unknown", cls: "badge-ghost" };
    if (diffDays < 90) return { label: "Not Available", cls: "badge-error" };
    return { label: "Available", cls: "badge-success" };
  };

  const handleSearch = async () => {
    // ✅ easy validation
    if (!bloodGroup || !division || !district) {
      setMsg("Blood group, Division, District select করো");
      setDonors([]);
      return;
    }

    try {
      setLoading(true);
      setMsg("");

      const params = new URLSearchParams();
      params.append("bloodGroup", bloodGroup);
      params.append("division", division);
      params.append("district", district);
      if (availableOnly) params.append("availableOnly", "true");

      const res = await axiosSecure.get(
        `/api/find/donors?${params.toString()}`,
      );

      const list = res.data || [];
      setDonors(list);
      if (!list.length) setMsg("No donors found");
    } catch (e) {
      console.log(e);
      setMsg("Failed to fetch donors");
      setDonors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setBloodGroup("");
    setDivision("");
    setDistrict("");
    setAvailableOnly(false);
    setDonors([]);
    setMsg("");
  };

  return (
    <section className="w-full bg-base-200/40 py-10 md:py-12">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold">Find Blood</h1>
            <p className="text-sm text-base-content/60 mt-1">
              Filter করে donors list দেখো — call/copy করো দ্রুত।
            </p>
          </div>

          <div className="flex gap-2">
            <button className="btn btn-ghost" onClick={handleReset}>
              Reset
            </button>
            <button
              className="btn btn-neutral"
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm" />
                  Searching...
                </>
              ) : (
                "Search"
              )}
            </button>
          </div>
        </div>

        {/* Filters Card */}
        <div className="mt-6 rounded-3xl bg-base-100 border border-base-200 shadow-xl p-5 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Blood */}
            <div className="md:col-span-3">
              <label className="label">
                <span className="label-text font-semibold">Blood Group</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
              >
                <option value="" disabled>
                  Select Blood Group
                </option>
                {BLOOD_GROUPS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* Division */}
            <div className="md:col-span-4">
              <label className="label">
                <span className="label-text font-semibold">Division</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={division}
                onChange={handleDivisionChange}
              >
                <option value="" disabled>
                  Select Division
                </option>
                {DIVISIONS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* District */}
            <div className="md:col-span-4">
              <label className="label">
                <span className="label-text font-semibold">District</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                disabled={!division}
              >
                <option value="" disabled>
                  {division ? "Select District" : "Select Division first"}
                </option>
                {districtOptions.map((dist) => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))}
              </select>
            </div>

            {/* Available Only */}
            <div className="md:col-span-1 flex items-end">
              <label className="label cursor-pointer justify-start gap-2">
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm"
                  checked={availableOnly}
                  onChange={(e) => setAvailableOnly(e.target.checked)}
                />
                <span className="label-text text-sm">Only</span>
              </label>
            </div>
          </div>

          {msg && (
            <div className="alert alert-info mt-4">
              <span>{msg}</span>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="mt-6 space-y-4">
          {!loading && donors.length > 0 && (
            <div className="text-sm text-base-content/60">
              Found <span className="font-bold">{donors.length}</span> donor(s)
            </div>
          )}

          {donors.map((d) => {
            const name =
              `${d.firstName || ""} ${d.lastName || ""}`.trim() || "Donor";
            const lastDonationISO = buildLastDonationDate(d);
            const availability = getAvailability(lastDonationISO);

            return (
              <div
                key={d._id}
                className="card bg-base-100 border border-base-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="card-body p-5 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    {/* Left */}
                    <div className="min-w-0">
                      <h2 className="text-xl font-extrabold truncate">
                        {name}
                      </h2>

                      <p className="text-sm text-base-content/60 mt-1">
                        {d.bloodGroup} • {d.district || "-"},{" "}
                        {d.division || "-"}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className={`badge ${availability.cls}`}>
                          {availability.label}
                        </span>

                        <span className="badge badge-outline">
                          Last Donation:{" "}
                          {lastDonationISO
                            ? formatDate(lastDonationISO)
                            : "Not provided"}
                        </span>
                      </div>

                      <p className="mt-3 text-sm">
                        <span className="font-semibold">Phone:</span>{" "}
                        <span className="font-mono">{d.phone || "-"}</span>
                      </p>
                    </div>

                    {/* Right actions */}
                    <div className="flex md:flex-col gap-2 md:items-end">
                      <a
                        className="btn btn-sm btn-success"
                        href={d.phone ? `tel:${d.phone}` : undefined}
                        onClick={(e) => {
                          if (!d.phone) e.preventDefault();
                        }}
                      >
                        Call
                      </a>

                      <button
                        className="btn btn-sm btn-outline"
                        onClick={() => {
                          if (!d.phone) return;
                          navigator.clipboard.writeText(d.phone);
                        }}
                        disabled={!d.phone}
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {!loading && !donors.length && !msg && (
            <div className="rounded-2xl border border-base-200 bg-base-100 p-6 text-sm text-base-content/60">
              Blood group + Division + District select করে Search করো।
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
