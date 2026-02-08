import React, { useEffect, useMemo, useRef, useState } from "react";
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

export default function NotificationsDropdown() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);
  const [err, setErr] = useState("");

  const boxRef = useRef(null);

  const unreadLocal = useMemo(
    () => items.filter((n) => !n.isRead).length,
    [items],
  );

  // keep badge in sync (server count or local list)
  useEffect(() => {
    if (items.length) setUnread(unreadLocal);
  }, [unreadLocal, items.length]);

  // close on outside click
  useEffect(() => {
    const onDoc = (e) => {
      if (!boxRef.current) return;
      if (!boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  // fetch count periodically (optional)
  useEffect(() => {
    let timer = null;

    const loadCount = async () => {
      try {
        const res = await axiosSecure.get("/api/notifications/unread-count");
        setUnread(Number(res.data?.unread || 0));
      } catch {
        // silent
      }
    };

    loadCount();
    timer = setInterval(loadCount, 20000); // 20s
    return () => timer && clearInterval(timer);
  }, []);

  const loadList = async () => {
    try {
      setErr("");
      setLoading(true);
      const res = await axiosSecure.get("/api/notifications/me?limit=30");
      setItems(res.data || []);
      setUnread((res.data || []).filter((n) => !n.isRead).length);
    } catch (e) {
      setErr("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (id) => {
    try {
      await axiosSecure.patch(`/api/notifications/${id}/read`);
      setItems((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
      );
    } catch {
      // ignore
    }
  };

  const markAllRead = async () => {
    try {
      await axiosSecure.patch("/api/notifications/mark-all-read/me");
      setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnread(0);
    } catch {
      // ignore
    }
  };

  const toggle = async () => {
    const next = !open;
    setOpen(next);
    if (next) await loadList();
  };

  return (
    <div className="relative" ref={boxRef}>
      <button
        className="btn btn-ghost btn-circle"
        onClick={toggle}
        aria-label="Notifications"
      >
        <div className="indicator">
          {unread > 0 && (
            <span className="indicator-item badge badge-error badge-sm">
              {unread > 99 ? "99+" : unread}
            </span>
          )}
          {/* Bell icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6 6 0 1 0-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a3 3 0 1 1-6 0m6 0H9"
            />
          </svg>
        </div>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-[92vw] max-w-sm rounded-2xl bg-base-100 border border-base-200 shadow-xl overflow-hidden z-50">
          <div className="px-4 py-3 bg-base-200/70 flex items-center justify-between">
            <div>
              <p className="font-extrabold">Notifications</p>
              <p className="text-xs text-base-content/60">
                Latest updates & requests
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                className="btn btn-xs btn-ghost"
                onClick={loadList}
                disabled={loading}
              >
                Refresh
              </button>
              <button
                className="btn btn-xs btn-outline"
                onClick={markAllRead}
                disabled={loading || (unread === 0 && unreadLocal === 0)}
              >
                Mark all read
              </button>
            </div>
          </div>

          <div className="max-h-[70vh] overflow-auto">
            {err && (
              <div className="p-4">
                <div className="alert alert-error">
                  <span>{err}</span>
                </div>
              </div>
            )}

            {loading ? (
              <div className="p-8 flex items-center justify-center">
                <span className="loading loading-spinner loading-lg" />
              </div>
            ) : items.length === 0 ? (
              <div className="p-6 text-sm text-base-content/60">
                No notifications yet.
              </div>
            ) : (
              <ul className="divide-y divide-base-200">
                {items.map((n) => (
                  <li key={n._id} className="p-4 hover:bg-base-200/40">
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-1 h-2.5 w-2.5 rounded-full ${
                          n.isRead ? "bg-base-300" : "bg-error"
                        }`}
                        title={n.isRead ? "Read" : "Unread"}
                      />

                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-sm truncate">
                          {n.title || "Notification"}
                        </p>
                        <p className="text-sm text-base-content/70 mt-1">
                          {n.message || ""}
                        </p>

                        {n.requestId && (
                          <div className="mt-2 text-xs text-base-content/60">
                            Request:{" "}
                            <span className="font-semibold">
                              {n.requestId.bloodGroup}
                            </span>{" "}
                            • {n.requestId.district || "-"} •{" "}
                            {n.requestId.hospitalName || "-"}
                          </div>
                        )}

                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-xs text-base-content/50">
                            {timeAgo(n.createdAt)}
                          </span>

                          {!n.isRead && (
                            <button
                              className="btn btn-xs btn-primary"
                              onClick={() => markRead(n._id)}
                            >
                              Mark read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="px-4 py-3 bg-base-200/60 flex justify-end">
            <button className="btn btn-sm" onClick={() => setOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
