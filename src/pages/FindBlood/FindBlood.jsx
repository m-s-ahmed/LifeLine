// import React, { useContext, useMemo, useState } from "react";
// import { axiosSecure } from "../../api/axiosSecure";
// import { AuthContext } from "../../providers/AuthProvider";

// import AddRequestModal from "../../components/AddRequestModal";
// import MyRequestsModal from "../../components/MyRequestModal";
// import SendRequestModal from "../../components/SendRequestModal";

// //Division list (BD)
// const DIVISIONS = [
//   "Dhaka",
//   "Chattogram",
//   "Rajshahi",
//   "Khulna",
//   "Barishal",
//   "Sylhet",
//   "Rangpur",
//   "Mymensingh",
// ];

// //Districts (starter set)
// const DISTRICTS_BY_DIVISION = {
//   Dhaka: ["Dhaka", "Gazipur", "Narayanganj", "Tangail", "Manikganj"],
//   Chattogram: ["Chattogram", "Cox's Bazar", "Cumilla", "Noakhali", "Feni"],
//   Rajshahi: ["Rajshahi", "Natore", "Naogaon", "Chapainawabganj", "Pabna"],
//   Khulna: ["Khulna", "Jashore", "Satkhira", "Kushtia", "Jhenaidah"],
//   Barishal: ["Barishal", "Patuakhali", "Bhola", "Jhalokathi", "Pirojpur"],
//   Sylhet: ["Sylhet", "Moulvibazar", "Habiganj", "Sunamganj"],
//   Rangpur: ["Rangpur", "Dinajpur", "Kurigram", "Gaibandha", "Nilphamari"],
//   Mymensingh: ["Mymensingh", "Jamalpur", "Netrokona", "Sherpur"],
// };

// const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

// // Month mapping (DB: "Jan" etc.)
// const MONTH_INDEX = {
//   Jan: 0,
//   Feb: 1,
//   Mar: 2,
//   Apr: 3,
//   May: 4,
//   Jun: 5,
//   Jul: 6,
//   Aug: 7,
//   Sep: 8,
//   Oct: 9,
//   Nov: 10,
//   Dec: 11,
// };

// export default function FindBlood() {
//   const { user } = useContext(AuthContext);

//   // modal state
//   const [openAdd, setOpenAdd] = useState(false);
//   const [openView, setOpenView] = useState(false);
//   const [openSend, setOpenSend] = useState(false);
//   const [selectedDonor, setSelectedDonor] = useState(null);

//   // filters
//   const [bloodGroup, setBloodGroup] = useState("");
//   const [division, setDivision] = useState("");
//   const [district, setDistrict] = useState("");
//   const [availableOnly, setAvailableOnly] = useState(false);

//   // result state
//   const [loading, setLoading] = useState(false);
//   const [donors, setDonors] = useState([]);
//   const [msg, setMsg] = useState("");

//   // current user info for modal prefilling
//   const me = useMemo(
//     () => ({
//       name: user?.displayName || "",
//       email: user?.email || "",
//       phone: "",
//       uid: user?.uid || "",
//     }),
//     [user],
//   );

//   const districtOptions = useMemo(
//     () => (division ? DISTRICTS_BY_DIVISION[division] || [] : []),
//     [division],
//   );

//   const handleDivisionChange = (e) => {
//     const v = e.target.value;
//     setDivision(v);
//     setDistrict("");
//   };

//   const buildLastDonationDate = (d) => {
//     if (d.lastDonationDate) return d.lastDonationDate;

//     const m = d.lastDonationMonth;
//     const y = d.lastDonationYear;

//     if (!m || !y) return null;
//     const mi = MONTH_INDEX[m];
//     const yi = Number(y);
//     if (mi === undefined || Number.isNaN(yi)) return null;

//     const dt = new Date(yi, mi, 1);
//     return dt.toISOString();
//   };

//   const formatDate = (iso) => {
//     if (!iso) return "";
//     const d = new Date(iso);
//     return d.toLocaleDateString(undefined, {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });
//   };

//   const getAvailability = (lastDonationISO) => {
//     if (!lastDonationISO) return { label: "Unknown", cls: "badge-ghost" };

//     const diffDays = Math.floor(
//       (Date.now() - new Date(lastDonationISO)) / (1000 * 60 * 60 * 24),
//     );

//     if (diffDays < 0) return { label: "Unknown", cls: "badge-ghost" };
//     if (diffDays < 90) return { label: "Not Available", cls: "badge-error" };
//     return { label: "Available", cls: "badge-success" };
//   };

//   const handleSearch = async () => {
//     if (!bloodGroup || !division || !district) {
//       setMsg("Blood group, Division, District select করো");
//       setDonors([]);
//       return;
//     }

//     try {
//       setLoading(true);
//       setMsg("");

//       const params = new URLSearchParams();
//       params.append("bloodGroup", bloodGroup);
//       params.append("division", division);
//       params.append("district", district);
//       if (availableOnly) params.append("availableOnly", "true");

//       const res = await axiosSecure.get(
//         `/api/find/donors?${params.toString()}`,
//       );
//       const list = res.data || [];

//       setDonors(list);
//       if (!list.length) setMsg("No donors found");
//     } catch (e) {
//       console.log(e);
//       setMsg("Failed to fetch donors");
//       setDonors([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleReset = () => {
//     setBloodGroup("");
//     setDivision("");
//     setDistrict("");
//     setAvailableOnly(false);
//     setDonors([]);
//     setMsg("");
//   };

//   return (
//     <section className="w-full bg-base-200/40 py-10 md:py-12">
//       <div className="mx-auto max-w-6xl px-4">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
//           <div>
//             <h1 className="text-3xl md:text-4xl font-extrabold">Find Blood</h1>
//             <p className="text-sm text-base-content/60 mt-1">
//               Filter করে donors list দেখো — call/copy/send request করো দ্রুত।
//             </p>
//           </div>

//           <div className="flex flex-wrap gap-2">
//             <button className="btn text-white btn-active btn-error" onClick={handleReset}>
//               Reset
//             </button>

//             <button
//               className="btn btn-outline text-black font-bold btn-success"
//               onClick={handleSearch}
//               disabled={loading}
//             >
//               {loading ? (
//                 <>
//                   <span className="loading loading-spinner loading-sm" />
//                   Searching...
//                 </>
//               ) : (
//                 "Search"
//               )}
//             </button>

//             <button
//               className="bg-red-950 text-white border border-red-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group"
//               onClick={() => setOpenAdd(true)}
//             >
//                 <span class="bg-red-400 shadow-red-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
//               Add Request
//             </button>

//             <button
//               className="bg-rose-950 text-white border border-rose-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group"
//               onClick={() => setOpenView(true)}
//             >
//                 <span class="bg-red-400 shadow-red-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
//               View Request
//             </button>
//           </div>
//         </div>

//         {/* Filters Card */}
//         <div className="mt-6 rounded-3xl bg-base-100 border border-base-200 shadow-xl p-5 md:p-6">
//           <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
//             {/* Blood */}
//             <div className="md:col-span-3">
//               <label className="label">
//                 <span className="label-text font-semibold">Blood Group</span>
//               </label>
//               <select
//                 className="select select-bordered w-full"
//                 value={bloodGroup}
//                 onChange={(e) => setBloodGroup(e.target.value)}
//               >
//                 <option value="" disabled>
//                   Select Blood Group
//                 </option>
//                 {BLOOD_GROUPS.map((b) => (
//                   <option key={b} value={b}>
//                     {b}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Division */}
//             <div className="md:col-span-4">
//               <label className="label">
//                 <span className="label-text font-semibold">Division</span>
//               </label>
//               <select
//                 className="select select-bordered w-full"
//                 value={division}
//                 onChange={handleDivisionChange}
//               >
//                 <option value="" disabled>
//                   Select Division
//                 </option>
//                 {DIVISIONS.map((d) => (
//                   <option key={d} value={d}>
//                     {d}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* District */}
//             <div className="md:col-span-4">
//               <label className="label">
//                 <span className="label-text font-semibold">District</span>
//               </label>
//               <select
//                 className="select select-bordered w-full"
//                 value={district}
//                 onChange={(e) => setDistrict(e.target.value)}
//                 disabled={!division}
//               >
//                 <option value="" disabled>
//                   {division ? "Select District" : "Select Division first"}
//                 </option>
//                 {districtOptions.map((dist) => (
//                   <option key={dist} value={dist}>
//                     {dist}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Available Only */}
//             <div className="md:col-span-1 flex items-end">
//               <label className="label cursor-pointer justify-start gap-2">
//                 <input
//                   type="checkbox"
//                   className="checkbox checkbox-sm"
//                   checked={availableOnly}
//                   onChange={(e) => setAvailableOnly(e.target.checked)}
//                 />
//                 <span className="label-text text-sm">Only</span>
//               </label>
//             </div>
//           </div>

//           {msg && (
//             <div className="alert alert-info mt-4">
//               <span>{msg}</span>
//             </div>
//           )}
//         </div>

//         {/* Results */}
//         <div className="mt-6 space-y-4">
//           {!loading && donors.length > 0 && (
//             <div className="text-sm text-base-content/60">
//               Found <span className="font-bold">{donors.length}</span> donor(s)
//             </div>
//           )}

//           {donors.map((d) => {
//             const name =
//               `${d.firstName || ""} ${d.lastName || ""}`.trim() || "Donor";
//             const lastDonationISO = buildLastDonationDate(d);
//             const availability = getAvailability(lastDonationISO);

//             // IMPORTANT: fallback uid mapping ( for Send Request )
//             const donorUid =
//               d.uid ||
//               d.firebaseUid ||
//               d.userUid ||
//               d.userId ||
//               d.authUid ||
//               "";

//             return (
//               <div
//                 key={d._id}
//                 className="card bg-base-100 border border-base-200 shadow-sm hover:shadow-md transition-shadow"
//               >
//                 <div className="card-body p-5 md:p-6">
//                   <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
//                     {/* Left */}
//                     <div className="min-w-0">
//                       <h2 className="text-xl font-extrabold truncate">
//                         {name}
//                       </h2>

//                       <p className="text-sm text-base-content/60 mt-1">
//                         {d.bloodGroup} • {d.district || "-"},{" "}
//                         {d.division || "-"}
//                       </p>

//                       <div className="mt-3 flex flex-wrap gap-2">
//                         <span className={`badge ${availability.cls}`}>
//                           {availability.label}
//                         </span>

//                         <span className="badge badge-outline">
//                           Last Donation:{" "}
//                           {lastDonationISO
//                             ? formatDate(lastDonationISO)
//                             : "Not provided"}
//                         </span>
//                       </div>

//                       <p className="mt-3 text-sm">
//                         <span className="font-semibold">Phone:</span>{" "}
//                         <span className="font-mono">{d.phone || "-"}</span>
//                       </p>

//                       {!donorUid && (
//                         <p className="mt-2 text-xs text-error">
//                           ⚠️ Donor UID missing from API response (send request
//                           disabled)
//                         </p>
//                       )}
//                     </div>

//                     {/* Right actions */}
//                     <div className="flex md:flex-col gap-2 md:items-end">
//                       <a
//                         className="btn btn-sm btn-success"
//                         href={d.phone ? `tel:${d.phone}` : undefined}
//                         onClick={(e) => {
//                           if (!d.phone) e.preventDefault();
//                         }}
//                       >
//                         Call
//                       </a>

//                       <button
//                         className="btn btn-sm btn-outline"
//                         onClick={() => {
//                           if (!d.phone) return;
//                           navigator.clipboard.writeText(d.phone);
//                         }}
//                         disabled={!d.phone}
//                       >
//                         Copy
//                       </button>

//                       <button
//                         className="btn btn-sm btn-primary"
//                         onClick={() => {
//                           setSelectedDonor({
//                             uid: donorUid,
//                             name,
//                             phone: d.phone || "",
//                             bloodGroup: d.bloodGroup || "",
//                             district: d.district || "",
//                             division: d.division || "",
//                           });
//                           setOpenSend(true);
//                         }}
//                         disabled={!donorUid}
//                         title={
//                           !donorUid ? "Donor uid missing in API response" : ""
//                         }
//                       >
//                         Send Request
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}

//           {!loading && !donors.length && !msg && (
//             <div className="rounded-2xl border border-base-200 bg-base-100 p-6 text-sm text-base-content/60">
//               Blood group + Division + District select করে Search করো।
//             </div>
//           )}
//         </div>
//       </div>

//       {/*MODALS */}
//       <AddRequestModal
//         open={openAdd}
//         onClose={() => setOpenAdd(false)}
//         me={me}
//         onCreated={() => {}}
//       />

//       <MyRequestsModal
//         open={openView}
//         onClose={() => setOpenView(false)}
//         me={me}
//       />

//       <SendRequestModal
//         open={openSend}
//         onClose={() => setOpenSend(false)}
//         donor={selectedDonor}
//         me={me}
//         onSent={() => setOpenSend(false)}
//       />
//     </section>
//   );
// }

//**************** */
import React, { useContext, useMemo, useState } from "react";
import { axiosSecure } from "../../api/axiosSecure";
import { AuthContext } from "../../providers/AuthProvider";

import AddRequestModal from "../../components/AddRequestModal";
import MyRequestsModal from "../../components/MyRequestModal";

// Division list (BD)
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

// Districts (starter set)
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

// Month mapping (DB: "Jan" etc.)
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
  const { user } = useContext(AuthContext);

  const [openAdd, setOpenAdd] = useState(false);
  const [openView, setOpenView] = useState(false);

  const [bloodGroup, setBloodGroup] = useState("");
  const [division, setDivision] = useState("");
  const [district, setDistrict] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);

  const [loading, setLoading] = useState(false);
  const [donors, setDonors] = useState([]);
  const [msg, setMsg] = useState("");

  const me = useMemo(
    () => ({
      name: user?.displayName || "",
      email: user?.email || "",
      phone: "",
      uid: user?.uid || "",
    }),
    [user],
  );

  const districtOptions = useMemo(
    () => (division ? DISTRICTS_BY_DIVISION[division] || [] : []),
    [division],
  );

  const handleDivisionChange = (e) => {
    const v = e.target.value;
    setDivision(v);
    setDistrict("");
  };

  const buildLastDonationDate = (d) => {
    if (d.lastDonationDate) return d.lastDonationDate;

    const m = d.lastDonationMonth;
    const y = d.lastDonationYear;

    if (!m || !y) return null;
    const mi = MONTH_INDEX[m];
    const yi = Number(y);
    if (mi === undefined || Number.isNaN(yi)) return null;

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

  const getAvailability = (lastDonationISO) => {
    if (!lastDonationISO) {
      return {
        label: "Unknown",
        cls: "badge-ghost",
        statusTitle: "Status Pending",
        statusText: "Donation history was not provided yet.",
        ring: "from-slate-200 to-slate-100",
        glow: "group-hover:shadow-slate-200/70",
      };
    }

    const diffDays = Math.floor(
      (Date.now() - new Date(lastDonationISO)) / (1000 * 60 * 60 * 24),
    );

    if (diffDays < 0) {
      return {
        label: "Unknown",
        cls: "badge-ghost",
        statusTitle: "Status Pending",
        statusText: "Donation history could not be verified.",
        ring: "from-slate-200 to-slate-100",
        glow: "group-hover:shadow-slate-200/70",
      };
    }

    if (diffDays < 90) {
      return {
        label: "Not Available",
        cls: "badge-error",
        statusTitle: "Resting Period",
        statusText: "This donor is currently within the recovery time.",
        ring: "from-rose-200 to-red-100",
        glow: "group-hover:shadow-rose-200/70",
      };
    }

    return {
      label: "Available",
      cls: "badge-success",
      statusTitle: "Ready to Help",
      statusText: "This donor is currently eligible to donate blood.",
      ring: "from-emerald-200 to-green-100",
      glow: "group-hover:shadow-emerald-200/70",
    };
  };

  const handleSearch = async () => {
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
    <section className="w-full bg-gradient-to-b from-base-200/30 via-white to-base-200/30 py-10 md:py-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              Find Blood
            </h1>
            <p className="text-sm text-base-content/60 mt-2">
              Filter করে premium donor profiles দেখো এবং suitable donor খুঁজে
              নাও।
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              className="btn text-white btn-active btn-error"
              onClick={handleReset}
            >
              Reset
            </button>

            <button
              className="btn btn-outline text-black font-bold btn-success"
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

            <button
              className="bg-red-950 text-white border border-red-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group"
              onClick={() => setOpenAdd(true)}
            >
              <span className="bg-red-400 shadow-red-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
              Add Request
            </button>

            <button
              className="bg-rose-950 text-white border border-rose-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group"
              onClick={() => setOpenView(true)}
            >
              <span className="bg-red-400 shadow-red-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
              View Request
            </button>
          </div>
        </div>

        <div className="mt-6 rounded-[28px] bg-base-100/95 border border-base-200 shadow-[0_12px_40px_rgba(0,0,0,0.08)] p-5 md:p-6 backdrop-blur">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
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

        <div className="mt-8 space-y-6">
          {!loading && donors.length > 0 && (
            <div className="text-sm text-base-content/60">
              Found <span className="font-bold">{donors.length}</span> donor(s)
            </div>
          )}

          {donors.map((d, index) => {
            const name =
              `${d.firstName || ""} ${d.lastName || ""}`.trim() || "Donor";
            const lastDonationISO = buildLastDonationDate(d);
            const availability = getAvailability(lastDonationISO);

            return (
              <div
                key={d._id}
                className={`group relative overflow-hidden rounded-[30px] border border-white/60 bg-white/90 backdrop-blur-xl shadow-[0_10px_35px_rgba(15,23,42,0.08)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_55px_rgba(15,23,42,0.12)] ${availability.glow} animate-[fadeInUp_0.6s_ease-out]`}
                style={{
                  animationDelay: `${index * 130}ms`,
                  animationFillMode: "both",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-red-50/40 to-white/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>

                <div className="relative p-6 md:p-7">
                  <div className="grid lg:grid-cols-[1.5fr_1fr] gap-6 items-center">
                    <div>
                      <div className="flex items-start gap-4">
                        <div
                          className={`relative flex h-16 w-16 shrink-0 items-center justify-center rounded-[22px] bg-gradient-to-br ${availability.ring} shadow-inner`}
                        >
                          <div className="absolute inset-1 rounded-[18px] bg-white/80 backdrop-blur"></div>
                          <span className="relative text-lg font-extrabold text-red-950">
                            {d.bloodGroup || "B"}
                          </span>
                        </div>

                        <div className="min-w-0">
                          <h2 className="text-2xl md:text-3xl font-black tracking-tight truncate text-slate-900">
                            {name}
                          </h2>
                          <p className="mt-1 text-sm md:text-base text-slate-500">
                            {d.district || "-"}, {d.division || "-"}
                          </p>

                          <div className="mt-4 flex flex-wrap gap-2">
                            <span
                              className={`badge ${availability.cls} badge-lg font-semibold`}
                            >
                              {availability.label}
                            </span>

                            <span className="badge badge-outline badge-lg">
                              Blood Group: {d.bloodGroup || "-"}
                            </span>

                            <span className="badge badge-outline badge-lg">
                              Last Donation:{" "}
                              {lastDonationISO
                                ? formatDate(lastDonationISO)
                                : "Not provided"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 grid sm:grid-cols-2 gap-3">
                        <div className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-4 transition-all duration-300 group-hover:bg-white">
                          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                            Donor Match
                          </p>
                          <p className="mt-2 text-sm text-slate-600">
                            This donor matches your current blood search
                            criteria and location.
                          </p>
                        </div>

                        <div className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-4 transition-all duration-300 group-hover:bg-white">
                          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                            Donation Insight
                          </p>
                          <p className="mt-2 text-sm text-slate-600">
                            Eligibility status is calculated from the donor’s
                            last donation information.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="relative">
                      <div className="rounded-[28px] border border-white/70 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-[1px] shadow-[0_18px_45px_rgba(15,23,42,0.18)] transition-all duration-500 group-hover:scale-[1.02]">
                        <div className="rounded-[27px] bg-white/95 px-6 py-6">
                          <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400 font-bold">
                            Donor Status
                          </p>

                          <h3 className="mt-3 text-2xl font-black tracking-tight text-slate-900">
                            {availability.statusTitle}
                          </h3>

                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            {availability.statusText}
                          </p>

                          <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                            <div
                              className={`h-full rounded-full ${
                                availability.label === "Available"
                                  ? "w-full bg-gradient-to-r from-emerald-400 to-green-500"
                                  : availability.label === "Not Available"
                                    ? "w-2/3 bg-gradient-to-r from-rose-400 to-red-500"
                                    : "w-1/3 bg-gradient-to-r from-slate-300 to-slate-400"
                              }`}
                            ></div>
                          </div>

                          <div className="mt-5 flex items-center justify-between text-xs text-slate-500">
                            <span>Profile Quality</span>
                            <span className="font-semibold">
                              {availability.label === "Available"
                                ? "High"
                                : availability.label === "Not Available"
                                  ? "Limited"
                                  : "Pending"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="absolute -right-3 -top-3 h-16 w-16 rounded-full bg-red-100/60 blur-2xl"></div>
                      <div className="absolute -left-3 -bottom-3 h-20 w-20 rounded-full bg-slate-200/60 blur-2xl"></div>
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

      <AddRequestModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        me={me}
        onCreated={() => {}}
      />

      <MyRequestsModal
        open={openView}
        onClose={() => setOpenView(false)}
        me={me}
      />

      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(24px) scale(0.98);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}
      </style>
    </section>
  );
}
