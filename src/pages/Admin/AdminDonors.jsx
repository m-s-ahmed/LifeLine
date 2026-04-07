// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { axiosSecure } from "../../api/axiosSecure";

// export default function AdminDashboard() {
//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [msg, setMsg] = useState("");
//   const [noteMap, setNoteMap] = useState({});
//   const [warnMap, setWarnMap] = useState({});

//   const [openDonorModal, setOpenDonorModal] = useState(false);
//   const [selectedRequest, setSelectedRequest] = useState(null);
//   const [matchingDonors, setMatchingDonors] = useState([]);
//   const [donorLoading, setDonorLoading] = useState(false);

//   const loadRequests = async () => {
//     try {
//       setLoading(true);
//       setMsg("");
//       const res = await axiosSecure.get("/api/admin/requests");
//       setRequests(res.data || []);
//     } catch (error) {
//       console.log(error);
//       setMsg("Failed to load admin requests");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadRequests();
//   }, []);

//   const loadMatchingDonors = async (requestId) => {
//     try {
//       setDonorLoading(true);
//       const res = await axiosSecure.get(
//         `/api/admin/requests/${requestId}/matching-donors`,
//       );
//       setMatchingDonors(res.data?.donors || []);
//     } catch (error) {
//       console.log(error);
//       setMatchingDonors([]);
//       setMsg("Failed to load matching donors");
//     } finally {
//       setDonorLoading(false);
//     }
//   };

//   const handleApprove = async (requestObj) => {
//     try {
//       const res = await axiosSecure.patch(
//         `/api/admin/requests/${requestObj._id}/approve`,
//         {
//           note: noteMap[requestObj._id] || "",
//         },
//       );

//       setMsg(res.data?.message || "Request approved successfully");
//       setSelectedRequest(requestObj);
//       setOpenDonorModal(true);
//       await loadMatchingDonors(requestObj._id);
//       loadRequests();
//     } catch (error) {
//       console.log(error);
//       setMsg("Failed to approve request");
//     }
//   };

//   const handleReject = async (id) => {
//     try {
//       await axiosSecure.patch(`/api/admin/requests/${id}/reject`, {
//         note: noteMap[id] || "",
//       });
//       setMsg("Request rejected successfully");
//       loadRequests();
//     } catch (error) {
//       console.log(error);
//       setMsg("Failed to reject request");
//     }
//   };

//   const handleWarn = async (uid) => {
//     try {
//       await axiosSecure.post(`/api/admin/users/${uid}/warn`, {
//         message:
//           warnMap[uid] ||
//           "Unusual activity detected. Please follow the platform rules.",
//       });
//       setMsg("Warning sent successfully");
//     } catch (error) {
//       console.log(error);
//       setMsg("Failed to send warning");
//     }
//   };

//   const handleNotifySingleDonor = async (uid) => {
//     try {
//       await axiosSecure.post(
//         `/api/admin/requests/${selectedRequest._id}/notify-donor/${uid}`,
//       );
//       setMsg("Notification sent to donor successfully");
//     } catch (error) {
//       console.log(error);
//       setMsg("Failed to notify donor");
//     }
//   };

//   const handleNotifyAllDonors = async () => {
//     try {
//       const res = await axiosSecure.post(
//         `/api/admin/requests/${selectedRequest._id}/notify-all-matching`,
//       );
//       setMsg(
//         `${res.data?.message || "Notifications sent"}${
//           res.data?.count !== undefined ? ` (${res.data.count} donor)` : ""
//         }`,
//       );
//     } catch (error) {
//       console.log(error);
//       setMsg("Failed to notify all matching donors");
//     }
//   };

//   return (
//     <section className="min-h-[calc(100vh-72px)] bg-base-200/40 py-10">
//       <div className="mx-auto max-w-7xl px-4">
//         <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
//           <div>
//             <h1 className="text-3xl md:text-4xl font-extrabold">
//               Admin Dashboard
//             </h1>
//             <p className="text-sm text-base-content/60 mt-1">
//               Review requests, approve genuine cases, reject suspicious
//               activity, and send warnings.
//             </p>
//           </div>

//           <div className="flex gap-2 flex-wrap">
//             <Link to="/admin-donors" className="btn btn-neutral">
//               Donor Explorer
//             </Link>
//             <button className="btn btn-outline" onClick={loadRequests}>
//               Refresh
//             </button>
//           </div>
//         </div>

//         {msg && (
//           <div className="alert alert-info mt-4">
//             <span>{msg}</span>
//           </div>
//         )}

//         {loading ? (
//           <div className="min-h-[50vh] flex items-center justify-center">
//             <span className="loading loading-spinner loading-lg"></span>
//           </div>
//         ) : (
//           <div className="mt-6 grid gap-5">
//             {requests.length > 0 ? (
//               requests.map((r) => (
//                 <div
//                   key={r._id}
//                   className="rounded-3xl bg-base-100 border border-base-200 shadow-xl p-5"
//                 >
//                   <div className="grid lg:grid-cols-3 gap-5">
//                     <div className="lg:col-span-2">
//                       <h2 className="text-xl font-extrabold">
//                         {r.requesterName || "Requester"}
//                       </h2>

//                       <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
//                         <p>
//                           <span className="font-semibold">Blood Group:</span>{" "}
//                           {r.bloodGroup || "-"}
//                         </p>
//                         <p>
//                           <span className="font-semibold">Units:</span>{" "}
//                           {r.units || 1}
//                         </p>
//                         <p>
//                           <span className="font-semibold">Division:</span>{" "}
//                           {r.division || "-"}
//                         </p>
//                         <p>
//                           <span className="font-semibold">District:</span>{" "}
//                           {r.district || "-"}
//                         </p>
//                         <p>
//                           <span className="font-semibold">Phone:</span>{" "}
//                           {r.requesterPhone || "-"}
//                         </p>
//                         <p>
//                           <span className="font-semibold">Patient:</span>{" "}
//                           {r.patientName || "-"}
//                         </p>
//                         <p className="md:col-span-2">
//                           <span className="font-semibold">Hospital:</span>{" "}
//                           {r.hospitalName || "-"}
//                         </p>
//                         <p className="md:col-span-2">
//                           <span className="font-semibold">Reason:</span>{" "}
//                           {r.reason || "-"}
//                         </p>
//                         <p className="md:col-span-2">
//                           <span className="font-semibold">Needed:</span>{" "}
//                           {r.neededDate || "-"}{" "}
//                           {r.neededTime ? `• ${r.neededTime}` : ""}
//                         </p>
//                       </div>

//                       <div className="mt-4 flex flex-wrap gap-2">
//                         <span className="badge badge-outline">
//                           Total Requests: {r.totalRequests || 0}
//                         </span>
//                         <span className="badge badge-outline">
//                           Last 7 Days: {r.recentRequests || 0}
//                         </span>

//                         {r.unusualActivity ? (
//                           <span className="badge badge-error">
//                             Unusual Activity
//                           </span>
//                         ) : (
//                           <span className="badge badge-success">
//                             Normal Activity
//                           </span>
//                         )}
//                       </div>
//                     </div>

//                     <div className="space-y-3">
//                       <textarea
//                         className="textarea textarea-bordered w-full"
//                         rows={3}
//                         placeholder="Admin note for approve/reject"
//                         value={noteMap[r._id] || ""}
//                         onChange={(e) =>
//                           setNoteMap((prev) => ({
//                             ...prev,
//                             [r._id]: e.target.value,
//                           }))
//                         }
//                       />

//                       <div className="flex flex-wrap gap-2">
//                         <button
//                           className="btn btn-success btn-sm"
//                           onClick={() => handleApprove(r)}
//                         >
//                           Approve
//                         </button>

//                         <button
//                           className="btn btn-error btn-sm"
//                           onClick={() => handleReject(r._id)}
//                         >
//                           Reject
//                         </button>
//                       </div>

//                       <textarea
//                         className="textarea textarea-bordered w-full"
//                         rows={2}
//                         placeholder="Warning message for this user"
//                         value={warnMap[r.requesterUid] || ""}
//                         onChange={(e) =>
//                           setWarnMap((prev) => ({
//                             ...prev,
//                             [r.requesterUid]: e.target.value,
//                           }))
//                         }
//                       />

//                       <button
//                         className="btn btn-warning btn-sm w-full"
//                         onClick={() => handleWarn(r.requesterUid)}
//                       >
//                         Send Warning
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="rounded-3xl border border-base-200 bg-base-100 p-8 text-center text-base-content/60">
//                 No pending admin review requests found.
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {openDonorModal && (
//         <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
//           <div className="w-full max-w-6xl rounded-3xl bg-base-100 shadow-2xl border border-base-200 max-h-[90vh] overflow-hidden">
//             <div className="px-6 py-5 border-b border-base-200 flex items-center justify-between">
//               <div>
//                 <h3 className="text-2xl font-extrabold">Matching Donors</h3>
//                 <p className="text-sm text-base-content/60 mt-1">
//                   Approved request donors based on blood group, location, and
//                   availability
//                 </p>
//               </div>

//               <button
//                 className="btn btn-sm btn-ghost"
//                 onClick={() => {
//                   setOpenDonorModal(false);
//                   setSelectedRequest(null);
//                   setMatchingDonors([]);
//                 }}
//               >
//                 ✕
//               </button>
//             </div>

//             <div className="p-6">
//               {selectedRequest && (
//                 <div className="mb-5 rounded-2xl border border-base-200 bg-base-200/40 p-4 text-sm">
//                   <p>
//                     <span className="font-semibold">Requester:</span>{" "}
//                     {selectedRequest.requesterName || "Requester"}
//                   </p>
//                   <p className="mt-1">
//                     <span className="font-semibold">Blood:</span>{" "}
//                     {selectedRequest.bloodGroup}
//                   </p>
//                   <p className="mt-1">
//                     <span className="font-semibold">Location:</span>{" "}
//                     {selectedRequest.district || "-"},{" "}
//                     {selectedRequest.division || "-"}
//                   </p>
//                   <p className="mt-1">
//                     <span className="font-semibold">Hospital:</span>{" "}
//                     {selectedRequest.hospitalName || "-"}
//                   </p>
//                 </div>
//               )}

//               <div className="mb-4 flex justify-end">
//                 <button
//                   className="btn btn-primary btn-sm"
//                   onClick={handleNotifyAllDonors}
//                   disabled={!matchingDonors.length}
//                 >
//                   Notify All Matching Donors
//                 </button>
//               </div>

//               {donorLoading ? (
//                 <div className="min-h-[220px] flex items-center justify-center">
//                   <span className="loading loading-spinner loading-lg"></span>
//                 </div>
//               ) : matchingDonors.length ? (
//                 <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
//                   {matchingDonors.map((d) => (
//                     <div
//                       key={d._id}
//                       className="rounded-2xl border border-base-200 bg-base-100 shadow-sm p-4"
//                     >
//                       <h4 className="text-lg font-bold">
//                         {d.firstName} {d.lastName}
//                       </h4>

//                       <div className="mt-3 space-y-1 text-sm text-base-content/70">
//                         <p>
//                           <span className="font-semibold">Blood:</span>{" "}
//                           {d.bloodGroup || "-"}
//                         </p>
//                         <p>
//                           <span className="font-semibold">Phone:</span>{" "}
//                           {d.phone || "-"}
//                         </p>
//                         <p>
//                           <span className="font-semibold">Location:</span>{" "}
//                           {d.district || "-"}, {d.division || "-"}
//                         </p>
//                         <p>
//                           <span className="font-semibold">Email:</span>{" "}
//                           {d.email || "-"}
//                         </p>
//                         <p>
//                           <span className="font-semibold">Last Donation:</span>{" "}
//                           {d.lastDonationMonth && d.lastDonationYear
//                             ? `${d.lastDonationMonth} ${d.lastDonationYear}`
//                             : "Not provided"}
//                         </p>
//                       </div>

//                       <div className="mt-4">
//                         <button
//                           className="btn btn-success btn-sm w-full"
//                           onClick={() => handleNotifySingleDonor(d.uid)}
//                         >
//                           Send Notification
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="rounded-2xl border border-base-200 bg-base-100 p-6 text-center text-base-content/60">
//                   No matching available donors found.
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </section>
//   );
// }

import { useEffect, useMemo, useState } from "react";
import { axiosSecure } from "../../api/axiosSecure";
import AdminTopNav from "../Admin/AdminTopNav";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

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

export default function AdminDonors() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const [bloodGroup, setBloodGroup] = useState("");
  const [division, setDivision] = useState("");
  const [district, setDistrict] = useState("");

  const [notifyTitle, setNotifyTitle] = useState("");
  const [notifyMessage, setNotifyMessage] = useState("");
  const [selectedUid, setSelectedUid] = useState("");

  const [popup, setPopup] = useState({
    open: false,
    title: "",
    message: "",
  });

  const districtOptions = useMemo(
    () => (division ? DISTRICTS_BY_DIVISION[division] || [] : []),
    [division],
  );

  const showPopup = (title, message) => {
    setPopup({ open: true, title, message });
  };

  const closePopup = () => {
    setPopup({ open: false, title: "", message: "" });
  };

  const loadDonors = async (override = {}) => {
    try {
      setLoading(true);
      setMsg("");

      const params = {};
      if (override.bloodGroup ?? bloodGroup)
        params.bloodGroup = override.bloodGroup ?? bloodGroup;
      if (override.division ?? division)
        params.division = override.division ?? division;
      if (override.district ?? district)
        params.district = override.district ?? district;

      const res = await axiosSecure.get("/api/admin/donors", { params });
      setDonors(res.data || []);
    } catch (error) {
      console.log(error);
      setMsg("Failed to load donors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDonors();
  }, []);

  const handleSearch = async () => {
    await loadDonors();
  };

  const handleReset = async () => {
    setBloodGroup("");
    setDivision("");
    setDistrict("");
    await loadDonors({ bloodGroup: "", division: "", district: "" });
  };

  const handleDivisionChange = (e) => {
    setDivision(e.target.value);
    setDistrict("");
  };

  const handleSendNotification = async () => {
    if (!selectedUid || !notifyTitle || !notifyMessage) {
      setMsg("Select donor, title, and message first");
      return;
    }

    try {
      const res = await axiosSecure.post(
        `/api/admin/donors/${selectedUid}/notify`,
        {
          title: notifyTitle,
          message: notifyMessage,
        },
      );

      showPopup(
        "Notification Sent",
        `${res.data?.donorName || "Selected donor"} এর কাছে successfully notification পাঠানো হয়েছে।`,
      );

      setNotifyTitle("");
      setNotifyMessage("");
      setSelectedUid("");
    } catch (error) {
      console.log(error);
      setMsg("Failed to send notification");
    }
  };

  return (
    <section className="min-h-[calc(100vh-72px)] bg-gradient-to-b from-base-200/40 via-white to-base-200/30 py-10">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-4">
          <h1 className="text-3xl md:text-4xl font-extrabold">
            Donor Explorer
          </h1>
          <p className="text-sm text-base-content/60 mt-1">
            View donors, filter by blood and location, and send direct
            notifications.
          </p>
        </div>

        <AdminTopNav />

        <div className="rounded-3xl bg-base-100 border border-base-200 shadow-xl p-5 md:p-6">
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
                <option value="">All Blood Groups</option>
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
                <option value="">All Divisions</option>
                {DIVISIONS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-3">
              <label className="label">
                <span className="label-text font-semibold">District</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                disabled={!division}
              >
                <option value="">
                  {division ? "All Districts" : "Select Division first"}
                </option>
                {districtOptions.map((dist) => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col lg:flex-row items-stretch lg:items-end gap-3 w-full">
              <button
                className="btn btn-success w-full lg:w-auto"
                onClick={handleSearch}
              >
                Search
              </button>
              <button
                className="btn btn-error w-full lg:w-auto"
                onClick={handleReset}
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {msg && (
          <div className="alert alert-info mt-4">
            <span>{msg}</span>
          </div>
        )}

        <div className="mt-6 rounded-3xl bg-base-100 border border-base-200 shadow-xl p-5 md:p-6">
          <h2 className="text-xl font-extrabold">Direct Notification</h2>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-4">
              <label className="label">
                <span className="label-text font-semibold">Select Donor</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={selectedUid}
                onChange={(e) => setSelectedUid(e.target.value)}
              >
                <option value="">Choose donor</option>
                {donors.map((d) => (
                  <option key={d.uid} value={d.uid}>
                    {d.firstName} {d.lastName} - {d.bloodGroup} - {d.district}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-4">
              <label className="label">
                <span className="label-text font-semibold">Title</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={notifyTitle}
                onChange={(e) => setNotifyTitle(e.target.value)}
                placeholder="Enter notification title"
              />
            </div>

            <div className="md:col-span-4">
              <label className="label">
                <span className="label-text font-semibold">Message</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={notifyMessage}
                onChange={(e) => setNotifyMessage(e.target.value)}
                placeholder="Enter notification message"
              />
            </div>
          </div>

          <div className="mt-4">
            <button
              className="btn btn-primary"
              onClick={handleSendNotification}
            >
              Send Direct Notification
            </button>
          </div>
        </div>

        {loading ? (
          <div className="min-h-[40vh] flex items-center justify-center">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {donors.map((d) => (
              <div
                key={d._id}
                className="rounded-3xl bg-base-100 border border-base-200 shadow-xl p-5"
              >
                <h3 className="text-xl font-extrabold">
                  {d.firstName} {d.lastName}
                </h3>

                <div className="mt-3 space-y-2 text-sm text-base-content/70">
                  <p className="break-all">
                    <span className="font-semibold">Email:</span>{" "}
                    {d.email || "-"}
                  </p>
                  <p>
                    <span className="font-semibold">Phone:</span>{" "}
                    {d.phone || "-"}
                  </p>
                  <p>
                    <span className="font-semibold">Blood Group:</span>{" "}
                    {d.bloodGroup || "-"}
                  </p>
                  <p>
                    <span className="font-semibold">Location:</span>{" "}
                    {d.district || "-"}, {d.division || "-"}
                  </p>
                  <p>
                    <span className="font-semibold">Status:</span>{" "}
                    {d.available ? (
                      <span className="badge badge-success">Available</span>
                    ) : (
                      <span className="badge badge-error">Not Available</span>
                    )}
                  </p>
                  <p>
                    <span className="font-semibold">Warnings:</span>{" "}
                    {d.warningCount || 0}
                  </p>
                </div>

                <div className="mt-4">
                  <button
                    className="btn btn-sm btn-primary w-full"
                    onClick={() => setSelectedUid(d.uid)}
                  >
                    Select for Notification
                  </button>
                </div>
              </div>
            ))}

            {!donors.length && (
              <div className="col-span-full rounded-3xl border border-base-200 bg-base-100 p-8 text-center text-base-content/60">
                No donors found.
              </div>
            )}
          </div>
        )}
      </div>

      {popup.open && (
        <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-green-500 px-6 py-5 text-white">
              <h3 className="text-2xl font-extrabold">{popup.title}</h3>
              <p className="text-sm text-white/85 mt-1">
                Operation completed successfully
              </p>
            </div>

            <div className="p-6">
              <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-4 text-sm text-slate-700">
                {popup.message}
              </div>

              <div className="mt-5 flex justify-end">
                <button className="btn btn-success" onClick={closePopup}>
                  Okay
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
