// import React, { useEffect, useMemo, useState } from "react";
// import AdminTopNav from "../Admin/AdminTopNav";
// import { axiosSecure } from "../../api/axiosSecure";

// function maxCount(items = []) {
//   return Math.max(...items.map((i) => i.count || 0), 1);
// }

// export default function AdminAnalytics() {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [msg, setMsg] = useState("");

//   const loadAnalytics = async () => {
//     try {
//       setLoading(true);
//       setMsg("");
//       const res = await axiosSecure.get("/api/admin/analytics");
//       setData(res.data);
//     } catch (error) {
//       console.log(error);
//       setMsg("Failed to load analytics");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadAnalytics();
//   }, []);

//   const bloodMax = useMemo(
//     () => maxCount(data?.requestsByBloodGroup || []),
//     [data],
//   );

//   const divisionMax = useMemo(
//     () => maxCount(data?.requestsByDivision || []),
//     [data],
//   );

//   if (loading) {
//     return (
//       <section className="min-h-[calc(100vh-72px)] bg-gradient-to-b from-base-200/40 via-white to-base-200/30 py-10">
//         <div className="mx-auto max-w-7xl px-4">
//           <div className="min-h-[50vh] flex items-center justify-center">
//             <span className="loading loading-spinner loading-lg"></span>
//           </div>
//         </div>
//       </section>
//     );
//   }

//   const overview = data?.overview || {};

//   return (
//     <section className="min-h-[calc(100vh-72px)] bg-gradient-to-b from-base-200/40 via-white to-base-200/30 py-10">
//       <div className="mx-auto max-w-7xl px-4">
//         <div className="mb-4">
//           <h1 className="text-3xl md:text-4xl font-extrabold">
//             Admin Analytics
//           </h1>
//           <p className="text-sm text-base-content/60 mt-1">
//             Donation ecosystem insights, request trends, donor availability, and
//             warning metrics.
//           </p>
//         </div>

//         <AdminTopNav />

//         <div className="flex justify-end">
//           <button className="btn btn-outline" onClick={loadAnalytics}>
//             Refresh Analytics
//           </button>
//         </div>

//         {msg && (
//           <div className="alert alert-info mt-4">
//             <span>{msg}</span>
//           </div>
//         )}

//         {/* Overview Cards */}
//         <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
//           <div className="rounded-3xl bg-base-100 border border-base-200 shadow-xl p-5">
//             <p className="text-sm text-base-content/60">Total Donors</p>
//             <h2 className="text-3xl font-extrabold mt-2">
//               {overview.totalDonors || 0}
//             </h2>
//           </div>

//           <div className="rounded-3xl bg-base-100 border border-base-200 shadow-xl p-5">
//             <p className="text-sm text-base-content/60">Available Donors</p>
//             <h2 className="text-3xl font-extrabold mt-2 text-green-600">
//               {overview.availableDonors || 0}
//             </h2>
//           </div>

//           <div className="rounded-3xl bg-base-100 border border-base-200 shadow-xl p-5">
//             <p className="text-sm text-base-content/60">Total Requests</p>
//             <h2 className="text-3xl font-extrabold mt-2">
//               {overview.totalRequests || 0}
//             </h2>
//           </div>

//           <div className="rounded-3xl bg-base-100 border border-base-200 shadow-xl p-5">
//             <p className="text-sm text-base-content/60">Last 7 Days Requests</p>
//             <h2 className="text-3xl font-extrabold mt-2 text-blue-600">
//               {overview.recent7DaysRequests || 0}
//             </h2>
//           </div>
//         </div>

//         {/* Status Cards */}
//         <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
//           <div className="rounded-3xl bg-base-100 border border-base-200 shadow-xl p-5">
//             <p className="text-sm text-base-content/60">Pending</p>
//             <h2 className="text-2xl font-extrabold mt-2 text-amber-600">
//               {overview.pendingRequests || 0}
//             </h2>
//           </div>

//           <div className="rounded-3xl bg-base-100 border border-base-200 shadow-xl p-5">
//             <p className="text-sm text-base-content/60">Approved</p>
//             <h2 className="text-2xl font-extrabold mt-2 text-emerald-600">
//               {overview.approvedRequests || 0}
//             </h2>
//           </div>

//           <div className="rounded-3xl bg-base-100 border border-base-200 shadow-xl p-5">
//             <p className="text-sm text-base-content/60">Rejected</p>
//             <h2 className="text-2xl font-extrabold mt-2 text-red-600">
//               {overview.rejectedRequests || 0}
//             </h2>
//           </div>

//           <div className="rounded-3xl bg-base-100 border border-base-200 shadow-xl p-5">
//             <p className="text-sm text-base-content/60">Completed</p>
//             <h2 className="text-2xl font-extrabold mt-2 text-slate-700">
//               {overview.completedRequests || 0}
//             </h2>
//           </div>
//         </div>

//         {/* Warning + Health Cards */}
//         <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
//           <div className="rounded-3xl bg-base-100 border border-base-200 shadow-xl p-6">
//             <h3 className="text-xl font-extrabold">Warning Overview</h3>
//             <div className="mt-4 grid grid-cols-2 gap-4">
//               <div className="rounded-2xl bg-base-200/50 p-4">
//                 <p className="text-sm text-base-content/60">Warned Users</p>
//                 <p className="text-2xl font-bold mt-2">
//                   {overview.warnedUsers || 0}
//                 </p>
//               </div>
//               <div className="rounded-2xl bg-base-200/50 p-4">
//                 <p className="text-sm text-base-content/60">Total Warnings</p>
//                 <p className="text-2xl font-bold mt-2">
//                   {overview.totalWarnings || 0}
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className="rounded-3xl bg-base-100 border border-base-200 shadow-xl p-6">
//             <h3 className="text-xl font-extrabold">Quick Insights</h3>
//             <div className="mt-4 space-y-3 text-sm text-base-content/70">
//               <p>
//                 <span className="font-semibold">Donor Readiness:</span>{" "}
//                 {overview.totalDonors
//                   ? `${Math.round(
//                       ((overview.availableDonors || 0) / overview.totalDonors) *
//                         100,
//                     )}% donors are currently available`
//                   : "No donor data available"}
//               </p>
//               <p>
//                 <span className="font-semibold">Approval Efficiency:</span>{" "}
//                 {overview.totalRequests
//                   ? `${Math.round(
//                       ((overview.approvedRequests || 0) /
//                         overview.totalRequests) *
//                         100,
//                     )}% of all requests were approved`
//                   : "No request data available"}
//               </p>
//               <p>
//                 <span className="font-semibold">Risk Monitoring:</span>{" "}
//                 {overview.warnedUsers > 0
//                   ? `${overview.warnedUsers} users need admin attention`
//                   : "No warning-risk user currently flagged"}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Blood Group + Division Charts */}
//         <div className="mt-6 grid grid-cols-1 xl:grid-cols-2 gap-5">
//           <div className="rounded-3xl bg-base-100 border border-base-200 shadow-xl p-6">
//             <h3 className="text-xl font-extrabold">Requests by Blood Group</h3>
//             <div className="mt-5 space-y-4">
//               {(data?.requestsByBloodGroup || []).length ? (
//                 data.requestsByBloodGroup.map((item) => (
//                   <div key={item._id || "unknown"}>
//                     <div className="flex justify-between text-sm font-medium mb-1">
//                       <span>{item._id || "Unknown"}</span>
//                       <span>{item.count}</span>
//                     </div>
//                     <div className="h-3 rounded-full bg-base-200 overflow-hidden">
//                       <div
//                         className="h-full rounded-full bg-red-500"
//                         style={{
//                           width: `${(item.count / bloodMax) * 100}%`,
//                         }}
//                       ></div>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-sm text-base-content/60">
//                   No blood group data found.
//                 </p>
//               )}
//             </div>
//           </div>

//           <div className="rounded-3xl bg-base-100 border border-base-200 shadow-xl p-6">
//             <h3 className="text-xl font-extrabold">Requests by Division</h3>
//             <div className="mt-5 space-y-4">
//               {(data?.requestsByDivision || []).length ? (
//                 data.requestsByDivision.map((item) => (
//                   <div key={item._id || "unknown"}>
//                     <div className="flex justify-between text-sm font-medium mb-1">
//                       <span>{item._id || "Unknown"}</span>
//                       <span>{item.count}</span>
//                     </div>
//                     <div className="h-3 rounded-full bg-base-200 overflow-hidden">
//                       <div
//                         className="h-full rounded-full bg-slate-700"
//                         style={{
//                           width: `${(item.count / divisionMax) * 100}%`,
//                         }}
//                       ></div>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-sm text-base-content/60">
//                   No division data found.
//                 </p>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Top Requesters */}
//         <div className="mt-6 rounded-3xl bg-base-100 border border-base-200 shadow-xl p-6">
//           <h3 className="text-xl font-extrabold">Top Requesters</h3>
//           <div className="mt-5 overflow-x-auto">
//             <table className="table">
//               <thead>
//                 <tr>
//                   <th>Name</th>
//                   <th>Email</th>
//                   <th>Phone</th>
//                   <th>Total Requests</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {(data?.topRequesters || []).length ? (
//                   data.topRequesters.map((u) => (
//                     <tr key={u._id}>
//                       <td>{u.requesterName || "Unknown"}</td>
//                       <td>{u.requesterEmail || "-"}</td>
//                       <td>{u.requesterPhone || "-"}</td>
//                       <td>{u.totalRequests || 0}</td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td
//                       colSpan="4"
//                       className="text-center text-base-content/60"
//                     >
//                       No requester stats available
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

import React, { useEffect, useMemo, useState } from "react";
import AdminTopNav from "../Admin/AdminTopNav";
import { axiosSecure } from "../../api/axiosSecure";

function maxCount(items = []) {
  return Math.max(...items.map((i) => i.count || 0), 1);
}

export default function AdminAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setMsg("");
      const res = await axiosSecure.get("/api/admin/analytics");
      setData(res.data);
    } catch (error) {
      console.log(error);
      setMsg("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const bloodMax = useMemo(
    () => maxCount(data?.requestsByBloodGroup || []),
    [data],
  );

  const divisionMax = useMemo(
    () => maxCount(data?.requestsByDivision || []),
    [data],
  );

  if (loading) {
    return (
      <section className="min-h-[calc(100vh-72px)] bg-gradient-to-br from-slate-100 via-white to-rose-50 py-10">
        <div className="mx-auto max-w-7xl px-4">
          <div className="min-h-[60vh] flex items-center justify-center">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        </div>
      </section>
    );
  }

  const overview = data?.overview || {};

  return (
    <section className="min-h-[calc(100vh-72px)] bg-gradient-to-br from-slate-100 via-white to-rose-50 py-10">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-slate-900 via-red-800 to-rose-600 bg-clip-text text-transparent">
            Admin Analytics
          </h1>
          <p className="text-sm md:text-base text-slate-500 mt-2">
            Donation ecosystem insights, request trends, donor readiness, and
            admin control metrics.
          </p>
        </div>

        <AdminTopNav />

        <div className="flex justify-end">
          <button
            className="rounded-2xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.02] hover:bg-slate-800"
            onClick={loadAnalytics}
          >
            Refresh Analytics
          </button>
        </div>

        {msg && (
          <div className="alert alert-info mt-4">
            <span>{msg}</span>
          </div>
        )}

        {/* Top Hero Cards */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <div className="rounded-[28px] bg-gradient-to-br from-slate-900 to-slate-700 text-white shadow-xl p-6">
            <p className="text-sm text-white/70">Total Donors</p>
            <h2 className="text-4xl font-black mt-3">
              {overview.totalDonors || 0}
            </h2>
            <p className="text-xs mt-3 text-white/60">
              Registered donor profiles in system
            </p>
          </div>

          <div className="rounded-[28px] bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-xl p-6">
            <p className="text-sm text-white/80">Available Donors</p>
            <h2 className="text-4xl font-black mt-3">
              {overview.availableDonors || 0}
            </h2>
            <p className="text-xs mt-3 text-white/70">
              Currently eligible to donate
            </p>
          </div>

          <div className="rounded-[28px] bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-xl p-6">
            <p className="text-sm text-white/80">Total Requests</p>
            <h2 className="text-4xl font-black mt-3">
              {overview.totalRequests || 0}
            </h2>
            <p className="text-xs mt-3 text-white/70">
              All requests submitted in platform
            </p>
          </div>

          <div className="rounded-[28px] bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-xl p-6">
            <p className="text-sm text-white/80">Last 7 Days</p>
            <h2 className="text-4xl font-black mt-3">
              {overview.recent7DaysRequests || 0}
            </h2>
            <p className="text-xs mt-3 text-white/70">
              Recent incoming blood requests
            </p>
          </div>
        </div>

        {/* Status Cards */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <div className="rounded-3xl bg-white border border-amber-100 shadow-lg p-5">
            <p className="text-sm text-slate-500">Pending</p>
            <h2 className="text-3xl font-black mt-2 text-amber-600">
              {overview.pendingRequests || 0}
            </h2>
            <div className="mt-4 h-2 rounded-full bg-amber-100 overflow-hidden">
              <div className="h-full w-3/4 rounded-full bg-amber-500"></div>
            </div>
          </div>

          <div className="rounded-3xl bg-white border border-emerald-100 shadow-lg p-5">
            <p className="text-sm text-slate-500">Approved</p>
            <h2 className="text-3xl font-black mt-2 text-emerald-600">
              {overview.approvedRequests || 0}
            </h2>
            <div className="mt-4 h-2 rounded-full bg-emerald-100 overflow-hidden">
              <div className="h-full w-4/5 rounded-full bg-emerald-500"></div>
            </div>
          </div>

          <div className="rounded-3xl bg-white border border-red-100 shadow-lg p-5">
            <p className="text-sm text-slate-500">Rejected</p>
            <h2 className="text-3xl font-black mt-2 text-red-600">
              {overview.rejectedRequests || 0}
            </h2>
            <div className="mt-4 h-2 rounded-full bg-red-100 overflow-hidden">
              <div className="h-full w-1/2 rounded-full bg-red-500"></div>
            </div>
          </div>

          <div className="rounded-3xl bg-white border border-slate-200 shadow-lg p-5">
            <p className="text-sm text-slate-500">Completed</p>
            <h2 className="text-3xl font-black mt-2 text-slate-800">
              {overview.completedRequests || 0}
            </h2>
            <div className="mt-4 h-2 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full w-2/3 rounded-full bg-slate-700"></div>
            </div>
          </div>
        </div>

        {/* Warning + Quick Insights */}
        <div className="mt-6 grid grid-cols-1 xl:grid-cols-2 gap-5">
          <div className="rounded-[30px] bg-white border border-base-200 shadow-xl p-6">
            <h3 className="text-2xl font-black text-slate-900">
              Warning Overview
            </h3>

            <div className="mt-5 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 border border-amber-100 p-5">
                <p className="text-sm text-slate-500">Warned Users</p>
                <p className="text-3xl font-black mt-2 text-amber-600">
                  {overview.warnedUsers || 0}
                </p>
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-rose-50 to-red-50 border border-red-100 p-5">
                <p className="text-sm text-slate-500">Total Warnings</p>
                <p className="text-3xl font-black mt-2 text-red-600">
                  {overview.totalWarnings || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[30px] bg-white border border-base-200 shadow-xl p-6">
            <h3 className="text-2xl font-black text-slate-900">
              Quick Insights
            </h3>

            <div className="mt-5 space-y-4">
              <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                <p className="text-sm text-slate-700">
                  <span className="font-bold">Donor Readiness:</span>{" "}
                  {overview.totalDonors
                    ? `${Math.round(
                        ((overview.availableDonors || 0) /
                          overview.totalDonors) *
                          100,
                      )}% donors are currently available`
                    : "No donor data available"}
                </p>
              </div>

              <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-4">
                <p className="text-sm text-slate-700">
                  <span className="font-bold">Approval Efficiency:</span>{" "}
                  {overview.totalRequests
                    ? `${Math.round(
                        ((overview.approvedRequests || 0) /
                          overview.totalRequests) *
                          100,
                      )}% of all requests were approved`
                    : "No request data available"}
                </p>
              </div>

              <div className="rounded-2xl bg-rose-50 border border-rose-100 p-4">
                <p className="text-sm text-slate-700">
                  <span className="font-bold">Risk Monitoring:</span>{" "}
                  {overview.warnedUsers > 0
                    ? `${overview.warnedUsers} users need admin attention`
                    : "No warning-risk user currently flagged"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="mt-6 grid grid-cols-1 xl:grid-cols-2 gap-5">
          <div className="rounded-[30px] bg-white border border-base-200 shadow-xl p-6">
            <h3 className="text-2xl font-black text-slate-900">
              Requests by Blood Group
            </h3>
            <div className="mt-5 space-y-5">
              {(data?.requestsByBloodGroup || []).length ? (
                data.requestsByBloodGroup.map((item) => (
                  <div key={item._id || "unknown"}>
                    <div className="flex justify-between text-sm font-semibold mb-2">
                      <span>{item._id || "Unknown"}</span>
                      <span>{item.count}</span>
                    </div>
                    <div className="h-3 rounded-full bg-rose-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-rose-500 to-red-600"
                        style={{
                          width: `${(item.count / bloodMax) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-base-content/60">
                  No blood group data found.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-[30px] bg-white border border-base-200 shadow-xl p-6">
            <h3 className="text-2xl font-black text-slate-900">
              Requests by Division
            </h3>
            <div className="mt-5 space-y-5">
              {(data?.requestsByDivision || []).length ? (
                data.requestsByDivision.map((item) => (
                  <div key={item._id || "unknown"}>
                    <div className="flex justify-between text-sm font-semibold mb-2">
                      <span>{item._id || "Unknown"}</span>
                      <span>{item.count}</span>
                    </div>
                    <div className="h-3 rounded-full bg-blue-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600"
                        style={{
                          width: `${(item.count / divisionMax) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-base-content/60">
                  No division data found.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Top Requesters */}
        <div className="mt-6 rounded-[30px] bg-white border border-base-200 shadow-xl p-6">
          <h3 className="text-2xl font-black text-slate-900">Top Requesters</h3>

          <div className="mt-5 overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Total Requests</th>
                </tr>
              </thead>
              <tbody>
                {(data?.topRequesters || []).length ? (
                  data.topRequesters.map((u) => (
                    <tr key={u._id}>
                      <td className="font-semibold">
                        {u.requesterName || "Unknown"}
                      </td>
                      <td>{u.requesterEmail || "-"}</td>
                      <td>{u.number|| "-"}</td>
                      <td>
                        <span className="badge badge-outline badge-primary">
                          {u.totalRequests || 0}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center text-base-content/60"
                    >
                      No requester stats available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
