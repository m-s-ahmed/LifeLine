import React, { useEffect, useState } from "react";
import { axiosSecure } from "../../api/axiosSecure";

export default function AdminDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [noteMap, setNoteMap] = useState({});
  const [warnMap, setWarnMap] = useState({});

  const loadRequests = async () => {
    try {
      setLoading(true);
      setMsg("");

      const res = await axiosSecure.get("/api/admin/requests");
      setRequests(res.data || []);
    } catch (error) {
      console.log(error);
      setMsg("Failed to load admin requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axiosSecure.patch(`/api/admin/requests/${id}/approve`, {
        note: noteMap[id] || "",
      });
      setMsg("Request approved successfully");
      loadRequests();
    } catch (error) {
      console.log(error);
      setMsg("Failed to approve request");
    }
  };

  const handleReject = async (id) => {
    try {
      await axiosSecure.patch(`/api/admin/requests/${id}/reject`, {
        note: noteMap[id] || "",
      });
      setMsg("Request rejected successfully");
      loadRequests();
    } catch (error) {
      console.log(error);
      setMsg("Failed to reject request");
    }
  };

  const handleWarn = async (uid) => {
    try {
      await axiosSecure.post(`/api/admin/users/${uid}/warn`, {
        message:
          warnMap[uid] ||
          "Unusual activity detected. Please follow the platform rules.",
      });
      setMsg("Warning sent successfully");
    } catch (error) {
      console.log(error);
      setMsg("Failed to send warning");
    }
  };

  return (
    <section className="min-h-[calc(100vh-72px)] bg-base-200/40 py-10">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold">
              Admin Dashboard
            </h1>
            <p className="text-sm text-base-content/60 mt-1">
              Review requests, approve genuine cases, reject suspicious
              activity, and send warnings.
            </p>
          </div>

          <button className="btn btn-outline" onClick={loadRequests}>
            Refresh
          </button>
        </div>

        {msg && (
          <div className="alert alert-info mt-4">
            <span>{msg}</span>
          </div>
        )}

        {loading ? (
          <div className="min-h-[50vh] flex items-center justify-center">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <div className="mt-6 grid gap-5">
            {requests.length > 0 ? (
              requests.map((r) => (
                <div
                  key={r._id}
                  className="rounded-3xl bg-base-100 border border-base-200 shadow-xl p-5"
                >
                  <div className="grid lg:grid-cols-3 gap-5">
                    <div className="lg:col-span-2">
                      <h2 className="text-xl font-extrabold">
                        {r.requesterName || "Requester"}
                      </h2>

                      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <p>
                          <span className="font-semibold">Blood Group:</span>{" "}
                          {r.bloodGroup || "-"}
                        </p>
                        <p>
                          <span className="font-semibold">Units:</span>{" "}
                          {r.units || 1}
                        </p>
                        <p>
                          <span className="font-semibold">Division:</span>{" "}
                          {r.division || "-"}
                        </p>
                        <p>
                          <span className="font-semibold">District:</span>{" "}
                          {r.district || "-"}
                        </p>
                        <p>
                          <span className="font-semibold">Phone:</span>{" "}
                          {r.requesterPhone || "-"}
                        </p>
                        <p>
                          <span className="font-semibold">Patient:</span>{" "}
                          {r.patientName || "-"}
                        </p>
                        <p className="md:col-span-2">
                          <span className="font-semibold">Hospital:</span>{" "}
                          {r.hospitalName || "-"}
                        </p>
                        <p className="md:col-span-2">
                          <span className="font-semibold">Reason:</span>{" "}
                          {r.reason || "-"}
                        </p>
                        <p className="md:col-span-2">
                          <span className="font-semibold">Needed:</span>{" "}
                          {r.neededDate || "-"}{" "}
                          {r.neededTime ? `• ${r.neededTime}` : ""}
                        </p>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="badge badge-outline">
                          Total Requests: {r.totalRequests || 0}
                        </span>
                        <span className="badge badge-outline">
                          Last 7 Days: {r.recentRequests || 0}
                        </span>

                        {r.unusualActivity ? (
                          <span className="badge badge-error">
                            Unusual Activity
                          </span>
                        ) : (
                          <span className="badge badge-success">
                            Normal Activity
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <textarea
                        className="textarea textarea-bordered w-full"
                        rows={3}
                        placeholder="Admin note for approve/reject"
                        value={noteMap[r._id] || ""}
                        onChange={(e) =>
                          setNoteMap((prev) => ({
                            ...prev,
                            [r._id]: e.target.value,
                          }))
                        }
                      />

                      <div className="flex flex-wrap gap-2">
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleApprove(r._id)}
                        >
                          Approve
                        </button>

                        <button
                          className="btn btn-error btn-sm"
                          onClick={() => handleReject(r._id)}
                        >
                          Reject
                        </button>
                      </div>

                      <textarea
                        className="textarea textarea-bordered w-full"
                        rows={2}
                        placeholder="Warning message for this user"
                        value={warnMap[r.requesterUid] || ""}
                        onChange={(e) =>
                          setWarnMap((prev) => ({
                            ...prev,
                            [r.requesterUid]: e.target.value,
                          }))
                        }
                      />

                      <button
                        className="btn btn-warning btn-sm w-full"
                        onClick={() => handleWarn(r.requesterUid)}
                      >
                        Send Warning
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-3xl border border-base-200 bg-base-100 p-8 text-center text-base-content/60">
                No pending admin review requests found.
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
