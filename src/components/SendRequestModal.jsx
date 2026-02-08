import React, { useEffect, useMemo, useState } from "react";
import { axiosSecure } from "../api/axiosSecure";

export default function SendRequestModal({ open, onClose, donor, me }) {
  const [loadingList, setLoadingList] = useState(false);
  const [sending, setSending] = useState(false);
  const [myReqs, setMyReqs] = useState([]);
  const [selected, setSelected] = useState("");
  const [msg, setMsg] = useState("");
  const [success, setSuccess] = useState("");

  // ✅ donor uid safe (fallbacks)
  const donorUid = useMemo(() => {
    if (!donor) return "";
    return (
      donor.uid ||
      donor.firebaseUid ||
      donor.userUid ||
      donor.userId ||
      donor.authUid ||
      ""
    );
  }, [donor]);

  useEffect(() => {
    if (!open) return;

    // ✅ reset every open
    setMsg("");
    setSuccess("");
    setSelected("");
    setMyReqs([]);

    const load = async () => {
      try {
        setLoadingList(true);

        const res = await axiosSecure.get("/api/requests/me");
        const openReqs = (res.data || []).filter((r) => r.status === "open");
        setMyReqs(openReqs);

        if (!openReqs.length) {
          setMsg("No open requests. আগে Add Request করে নাও।");
        }
      } catch (e) {
        setMsg(e?.response?.data?.message || "Failed to load your requests");
      } finally {
        setLoadingList(false);
      }
    };

    load();
  }, [open]);

  if (!open) return null;

  const send = async () => {
    setMsg("");
    setSuccess("");

    if (!donorUid) {
      setMsg(
        "Donor UID missing. Backend থেকে donor uid পাঠানো হচ্ছে কিনা চেক করো।",
      );
      return;
    }
    if (!selected) {
      setMsg("Select a request first");
      return;
    }

    try {
      setSending(true);

      // ✅ payload (you can add extra fields if your backend needs)
      const payload = {
        toUid: donorUid,
        requestId: selected,
        // optional meta (future)
        donorName: donor?.name || "",
        fromUid: me?.uid || "",
        fromName: me?.name || "",
      };

      await axiosSecure.post("/api/notifications/send", payload);

      setSuccess("Request sent ✅");
      // optional: auto close after 800ms
      setTimeout(() => onClose?.(), 700);
    } catch (e) {
      setMsg(e?.response?.data?.message || "Send failed");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 px-3 py-6 overflow-y-auto">
      <div className="mx-auto w-full max-w-xl rounded-2xl bg-base-100 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-base-200/70 px-5 py-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-extrabold text-lg">Send Request</h3>
            <p className="text-sm text-base-content/60 mt-1">
              Donor:{" "}
              <span className="font-semibold">{donor?.name || "Donor"}</span>
            </p>
            {!donorUid && (
              <p className="text-xs text-error mt-1">
                ⚠️ Donor uid missing (Send disabled)
              </p>
            )}
          </div>

          <button className="btn btn-sm btn-ghost" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {msg && (
            <div className="alert alert-error">
              <span>{msg}</span>
            </div>
          )}

          {success && (
            <div className="alert alert-success">
              <span>{success}</span>
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
              disabled={loadingList || sending || !myReqs.length}
            >
              <option value="" disabled>
                {loadingList ? "Loading..." : "Select request"}
              </option>

              {myReqs.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.bloodGroup} • {r.district} • {r.neededDate} •{" "}
                  {r.hospitalName}
                </option>
              ))}
            </select>

            {/* ✅ small screen friendly list */}
            {myReqs.length > 0 && (
              <div className="mt-3 max-h-48 overflow-auto rounded-xl border border-base-200">
                <ul className="divide-y divide-base-200">
                  {myReqs.map((r) => (
                    <li key={r._id} className="p-3 text-sm">
                      <div className="font-semibold">
                        {r.bloodGroup} • {r.units || 1} unit
                      </div>
                      <div className="text-base-content/60">
                        {r.hospitalName} — {r.district} ({r.neededDate})
                      </div>
                      <button
                        className={`btn btn-xs mt-2 ${
                          selected === r._id ? "btn-primary" : "btn-outline"
                        }`}
                        onClick={() => setSelected(r._id)}
                        disabled={loadingList || sending}
                      >
                        {selected === r._id ? "Selected" : "Select"}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              className="btn btn-ghost"
              onClick={onClose}
              disabled={sending}
            >
              Cancel
            </button>

            <button
              className="btn btn-primary"
              onClick={send}
              disabled={sending || loadingList || !myReqs.length || !donorUid}
            >
              {sending ? (
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
