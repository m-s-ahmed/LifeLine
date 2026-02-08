import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { axiosSecure } from "../api/axiosSecure";

function timeAgo(dateStr) {
  const d = new Date(dateStr);
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (Number.isNaN(diff) || diff < 0) return "";
  if (diff < 60) return `${diff}s ago`;
  const m = Math.floor(diff / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const day = Math.floor(h / 24);
  return `${day}d ago`;
}

export default function NotificationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [n, setN] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setErr("");
        setLoading(true);

        const res = await axiosSecure.get(`/api/notifications/${id}`);
        setN(res.data);

        await axiosSecure.patch(`/api/notifications/${id}/read`);
      } catch (e) {
        setErr(e?.response?.data?.message || "Failed to load notification");
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (err) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="alert alert-error">
          <span>{err}</span>
        </div>
        <button className="btn mt-4" onClick={() => navigate(-1)}>
          Go back
        </button>
      </div>
    );
  }

  if (!n) return null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold">
            {n.title || "Notification"}
          </h1>
          <p className="text-sm text-base-content/60 mt-1">
            {timeAgo(n.createdAt)} • {n.isRead ? "Read" : "Unread"}
          </p>
        </div>
        <button className="btn btn-ghost" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>

      <div className="mt-6 card bg-base-100 border border-base-200 shadow-xl">
        <div className="card-body">
          <p className="text-base-content/80 leading-relaxed">
            {n.message || ""}
          </p>

          {n.requestId && (
            <div className="mt-5 rounded-2xl border border-base-200 bg-base-200/40 p-4">
              <p className="font-bold">Request Summary</p>

              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="font-semibold">Blood:</span>{" "}
                  {n.requestId.bloodGroup || "-"}
                </div>

                <div>
                  <span className="font-semibold">Units:</span>{" "}
                  {n.requestId.units || "-"}
                </div>

                {/* ✅ NEW: number field */}
                <div className="md:col-span-2">
                  <span className="font-semibold">Number:</span>{" "}
                  {n.requestId.number || "-"}
                </div>

                <div>
                  <span className="font-semibold">District:</span>{" "}
                  {n.requestId.district || "-"}
                </div>

                <div>
                  <span className="font-semibold">Division:</span>{" "}
                  {n.requestId.division || "-"}
                </div>

                <div className="md:col-span-2">
                  <span className="font-semibold">Hospital:</span>{" "}
                  {n.requestId.hospitalName || "-"}
                </div>

                <div className="md:col-span-2">
                  <span className="font-semibold">Needed:</span>{" "}
                  {n.requestId.neededDate || "-"}{" "}
                  {n.requestId.neededTime ? `• ${n.requestId.neededTime}` : ""}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Link to="/findblood" className="btn btn-sm btn-primary">
                  Find Donors
                </Link>
                <Link to="/feedback" className="btn btn-sm btn-outline">
                  Give Feedback
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
