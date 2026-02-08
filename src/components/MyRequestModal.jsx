import React, { useEffect, useState } from "react";
import { axiosSecure } from "../api/axiosSecure";

export default function MyRequestsModal({ open, onClose }) {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [expandedId, setExpandedId] = useState("");
  const [msg, setMsg] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setMsg("");
      const res = await axiosSecure.get("/api/requests/me");
      setList(res.data || []);
    } catch (e) {
      setMsg("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) load();
  }, [open]);

  if (!open) return null;

  const closeReq = async (id) => {
    await axiosSecure.patch(`/api/requests/${id}/close`);
    load();
  };

  const delReq = async (id) => {
    if (!confirm("Delete this request?")) return;
    await axiosSecure.delete(`/api/requests/${id}`);
    load();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-3">
      <div className="w-full max-w-3xl rounded-2xl bg-base-100 shadow-2xl overflow-hidden">
        <div className="bg-base-200/70 px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-lg">My Blood Requests</h3>
            <p className="text-sm text-base-content/60">
              এখানে তোমার সব request দেখাবে। চাইলে close/delete করতে পারবে।
            </p>
          </div>
          <button className="btn btn-sm" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="p-6">
          {msg && (
            <div className="alert alert-error">
              <span>{msg}</span>
            </div>
          )}

          {loading ? (
            <div className="py-10 text-center">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : list.length === 0 ? (
            <div className="rounded-2xl border border-base-200 p-6 text-sm text-base-content/60">
              No requests yet.
            </div>
          ) : (
            <div className="space-y-3">
              {list.map((r) => {
                const isOpen = expandedId === r._id;
                return (
                  <div
                    key={r._id}
                    className="rounded-2xl border border-base-200 bg-base-100 p-4"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div>
                        <div className="font-extrabold">
                          {r.bloodGroup} • {r.district || "-"} ({r.status})
                        </div>
                        <div className="text-sm text-base-content/60">
                          Hospital: {r.hospitalName || "-"} • Date:{" "}
                          {r.neededDate || "-"}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          className="btn btn-sm btn-outline"
                          onClick={() => setExpandedId(isOpen ? "" : r._id)}
                        >
                          {isOpen ? "Hide" : "View Details"}
                        </button>

                        {r.status === "open" && (
                          <button
                            className="btn btn-sm btn-warning"
                            onClick={() => closeReq(r._id)}
                          >
                            Close
                          </button>
                        )}

                        <button
                          className="btn btn-sm btn-error"
                          onClick={() => delReq(r._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    {isOpen && (
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <Info label="Units" value={r.units} />
                        <Info label="Division" value={r.division} />
                        <Info label="District" value={r.district} />
                        <Info
                          label="Hospital Address"
                          value={r.hospitalAddress}
                        />

                        {/* ✅ NEW: number field */}
                        <Info label="Number" value={r.number} />

                        <Info label="Patient" value={r.patientName} />
                        <Info label="Relation" value={r.relation} />
                        <Info label="Time" value={r.neededTime} />
                        <Info label="Reason" value={r.reason} />
                        <div className="md:col-span-2">
                          <Info label="Note" value={r.note} />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex justify-end pt-5">
            <button className="btn btn-ghost" onClick={load}>
              Refresh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-xl bg-base-200/40 p-3">
      <div className="text-xs font-bold text-base-content/60">{label}</div>
      <div className="font-semibold">{value || "-"}</div>
    </div>
  );
}
