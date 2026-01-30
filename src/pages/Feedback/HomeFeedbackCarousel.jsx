import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function HomeFeedbackCarousel({ limit = 12 }) {
  const API = import.meta.env.VITE_API_URL;

  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const [error, setError] = useState("");

  const canFetch = useMemo(() => Boolean(API), [API]);
  const trackRef = useRef(null);

  useEffect(() => {
    let ignore = false;

    const run = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${API}/api/feedback/public?limit=${limit}`);
        const data = await res.json();

        if (!res.ok)
          throw new Error(data?.message || "Failed to load feedback");
        if (!ignore) setList(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!ignore) setError(e?.message || "Something went wrong");
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    if (canFetch) run();
    return () => {
      ignore = true;
    };
  }, [API, limit, canFetch]);

  const scrollByCards = (dir = 1) => {
    const el = trackRef.current;
    if (!el) return;

    const card = el.querySelector("[data-card]");
    const step = card ? card.getBoundingClientRect().width + 16 : 320;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section className="w-full bg-base-200/40 py-10 md:py-14">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="badge badge-primary badge-outline">
              Community Feedback
            </p>
            <h2 className="mt-3 text-2xl md:text-3xl font-extrabold">
              People love using LifeLine
            </h2>
            <p className="mt-2 text-base-content/70 max-w-2xl">
              Recent feedback from donors and receivers. Your feedback helps us
              improve and save more lives.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <Link to="/feedback" className="btn btn-primary rounded-full">
              Give Feedback
            </Link>

            <div className="join">
              <button
                className="btn btn-ghost join-item"
                onClick={() => scrollByCards(-1)}
                aria-label="Previous"
                title="Previous"
                type="button"
              >
                ❮
              </button>
              <button
                className="btn btn-ghost join-item"
                onClick={() => scrollByCards(1)}
                aria-label="Next"
                title="Next"
                type="button"
              >
                ❯
              </button>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="mt-7">
          {!canFetch && (
            <div className="alert alert-warning rounded-2xl">
              <span className="text-sm">
                API URL missing. Set <b>VITE_API_URL</b> in your frontend .env
              </span>
            </div>
          )}

          {canFetch && loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="card bg-base-100 shadow rounded-2xl border border-base-200"
                >
                  <div className="card-body">
                    <div className="skeleton h-4 w-1/2" />
                    <div className="skeleton h-3 w-1/3 mt-2" />
                    <div className="skeleton h-16 w-full mt-4" />
                    <div className="skeleton h-4 w-24 mt-4" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {canFetch && !loading && error && (
            <div className="alert alert-error rounded-2xl">
              <span className="text-sm">{error}</span>
            </div>
          )}

          {canFetch && !loading && !error && list.length === 0 && (
            <div className="card bg-base-100 shadow rounded-2xl border border-base-200">
              <div className="card-body">
                <h3 className="font-bold text-lg">No feedback yet</h3>
                <p className="text-base-content/70">
                  Be the first to share your experience.
                </p>
                <div className="mt-3">
                  <Link to="/feedback" className="btn btn-primary rounded-full">
                    Write a Feedback
                  </Link>
                </div>
              </div>
            </div>
          )}

          {canFetch && !loading && !error && list.length > 0 && (
            <>
              {/* Carousel track */}
              <div
                ref={trackRef}
                className="carousel carousel-center rounded-2xl w-full space-x-4 p-1 overflow-x-auto scroll-smooth"
                style={{ scrollSnapType: "x mandatory" }}
              >
                {list.map((fb, idx) => (
                  <div
                    key={fb?._id || idx}
                    className="carousel-item"
                    style={{ scrollSnapAlign: "start" }}
                  >
                    <div
                      data-card
                      className="w-[86vw] sm:w-[420px] md:w-[440px] lg:w-[380px]"
                    >
                      <FeedbackCard fb={fb} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3 text-xs text-base-content/60 flex items-center justify-between">
                <span>Tip: swipe/scroll on mobile.</span>
                <Link to="/feedback" className="link link-hover">
                  View / Submit Feedback →
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function FeedbackCard({ fb }) {
  const name = fb?.name?.trim() || "Anonymous";
  const role = (fb?.role || "").trim();
  const rating = clampInt(fb?.rating);
  const message = fb?.message || "";
  const createdAt = fb?.createdAt ? new Date(fb.createdAt) : null;

  const initials = getInitials(name);
  const dateText = createdAt ? createdAt.toLocaleDateString() : "";

  return (
    <div className="card bg-base-100 shadow-xl rounded-2xl border border-base-200">
      <div className="card-body">
        {/* Top */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Centered initial */}
            <div className="w-11 h-11 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center">
              <span className="text-primary font-extrabold text-sm leading-none">
                {initials}
              </span>
            </div>

            <div>
              <p className="font-extrabold leading-none">{name}</p>
              <p className="text-xs text-base-content/60 mt-1">
                {role ? roleLabel(role) : "Community Member"}
                {dateText ? ` • ${dateText}` : ""}
              </p>
            </div>
          </div>

          <div
            title={`Rating: ${rating}/5`}
            className="flex items-center gap-1"
          >
            <ExactStars value={rating} />
          </div>
        </div>

        {/* Quote accent */}
        <div className="mt-4 rounded-xl bg-base-200/50 p-4 border border-base-200">
          <p className="text-base-content/70 leading-relaxed line-clamp-4">
            <span className="text-primary font-extrabold">“</span>
            {message}
            <span className="text-primary font-extrabold">”</span>
          </p>
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between text-xs text-base-content/50">
          <span className="badge badge-ghost">{rating}/5</span>
          <span>Thank you for helping improve LifeLine ❤️</span>
        </div>
      </div>
    </div>
  );
}

/** Shows exactly N filled stars (0..5) */
function ExactStars({ value = 0 }) {
  const v = clampInt(value);

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < v;
        return (
          <span
            key={i}
            className={`text-lg leading-none ${filled ? "text-warning" : "text-base-300"}`}
          >
            ★
          </span>
        );
      })}
    </div>
  );
}

function clampInt(n) {
  const v = Math.round(Number(n || 0));
  return Math.max(0, Math.min(5, v));
}

function getInitials(name) {
  const parts = String(name).trim().split(/\s+/).slice(0, 2);
  const a = parts[0]?.[0] || "A";
  const b = parts[1]?.[0] || "";
  return (a + b).toUpperCase();
}

function roleLabel(role) {
  const r = role.toLowerCase();
  if (r === "donor") return "Donor";
  if (r === "receiver") return "Receiver";
  if (r === "volunteer") return "Volunteer";
  if (r === "organization") return "Organization";
  if (r === "visitor") return "Visitor";
  return "Community Member";
}
