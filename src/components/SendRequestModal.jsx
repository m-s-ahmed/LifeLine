import React, { useEffect, useState } from "react";
import { axiosSecure } from "../api/axiosSecure";

export default function SendRequestModal({ open, onClose, donor }) {
  const [loading, setLoading] = useState(false);
  const [myReqs, setMyReqs] = useState([]);
  const [selected, setSelected] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get("/api/requests/me");
        const openReqs = (res.data || []).filter((r) => r.status === "open");
        setMyReqs(openReqs);
      } catch (e) {
        setMsg("Failed to load your requests");
      } finally {
        setLoading(false);
      }
    };
    if (open) load();
  }, [open]);

  if (!open) return null;

  const send = async () => {
    setMsg("");
    if (!selected) return setMsg("Select a request first");
    try {
      setLoading(true);
      await axiosSecure.post("/api/notifications/send", {
        toUid: donor?.uid,
        requestId: selected,
      });
      onClose();
      alert("Request sent ✅");
    } catch (e) {
      setMsg(e?.response?.data?.message || "Send failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-3">
      <div className="w-full max-w-xl rounded-2xl bg-base-100 shadow-2xl overflow-hidden">
        <div className="bg-base-200/70 px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-lg">Send Request</h3>
            <p className="text-sm text-base-content/60">
              Donor:{" "}
              <span className="font-semibold">{donor?.name || "Donor"}</span>
            </p>
          </div>
          <button className="btn btn-sm" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="p-6 space-y-4">
          {msg && (
            <div className="alert alert-error">
              <span>{msg}</span>
            </div>
          )}

          <div>
            <label className="label">
              <span className="label-text font-semibold">
                Select one of your open requests
              </span>
            </label>

            <select
              className="select select-bordered w-full"
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              disabled={loading}
            >
              <option value="" disabled>
                Select request
              </option>
              {myReqs.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.bloodGroup} • {r.district} • {r.neededDate} •{" "}
                  {r.hospitalName}
                </option>
              ))}
            </select>

            {myReqs.length === 0 && (
              <p className="mt-2 text-sm text-base-content/60">
                No open requests. আগে Add Request করে নাও।
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <button className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={send}
              disabled={loading || !myReqs.length}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                "Send"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
