import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

export default function EventsSection({
  title = "LifeLine Events",
  subtitle = "Blood donation camps, awareness programs, and emergency drives — stay connected with our community.",
  showCTA = true,
}) {
  const events = useMemo(
    () => [
      {
        id: "ev-01",
        type: "Blood Donation Camp",
        title: "LifeLine Blood Donation Camp — Rajshahi",
        date: "Feb 10, 2026",
        time: "10:00 AM – 4:00 PM",
        location: "Rajshahi City Center, Rajshahi",
        status: "ongoing", // upcoming | ongoing | completed
        highlights: ["Free blood grouping", "Doctor support", "Donor snacks"],
      },
      {
        id: "ev-02",
        type: "Awareness Session",
        title: "Safe Blood Donation Awareness Workshop",
        date: "Feb 18, 2026",
        time: "3:00 PM – 5:00 PM",
        location: "RU Auditorium, Rajshahi",
        status: "upcoming",
        highlights: ["Donation rules", "Myths vs facts", "Q&A session"],
      },
      {
        id: "ev-03",
        type: "Emergency Drive",
        title: "Emergency Blood Drive (Volunteer Meetup)",
        date: "Mar 02, 2026",
        time: "5:00 PM – 7:00 PM",
        location: "Online (Google Meet)",
        status: "completed",
        highlights: [
          "Volunteer onboarding",
          "Response workflow",
          "Contact chain",
        ],
      },
    ],
    [],
  );

  const [filter, setFilter] = useState("all"); // all | upcoming | ongoing | completed

  const filtered = useMemo(() => {
    if (filter === "all") return events;
    return events.filter((e) => e.status === filter);
  }, [events, filter]);

  return (
    <section className="w-full bg-base-200/40 mt-10 py-10 md:py-14">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="badge badge-outline">LifeLine Community</p>
            <h2 className="mt-3 text-2xl md:text-3xl font-extrabold">
              {title}
            </h2>
            <p className="mt-2 text-base-content/70 max-w-2xl">{subtitle}</p>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <select
              className="select select-bordered rounded-full"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>

            {showCTA && (
              <Link to="/regasdonor" className="btn btn-primary rounded-full">
                Become a Donor
              </Link>
            )}
          </div>
        </div>

        {/* Events */}
        <div className="mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((ev) => (
            <EventCard key={ev.id} ev={ev} />
          ))}
        </div>

        {/* Footer CTA */}
        {showCTA && (
          <div className="mt-8 rounded-2xl border border-base-200 bg-base-100 shadow p-6 md:p-7">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-lg font-extrabold">
                  Want to organize an event with LifeLine?
                </h3>
                <p className="text-base-content/70 mt-1">
                  If you are an organization or volunteer team, we can
                  coordinate camps and emergency support.
                </p>
              </div>

              <div className="flex gap-2">
                <Link
                  to="/regasorganization"
                  className="btn btn-outline rounded-full"
                >
                  Register Organization
                </Link>
                <Link to="/feedback" className="btn btn-ghost rounded-full">
                  Contact / Feedback
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function EventCard({ ev }) {
  const badgeClass =
    ev.status === "ongoing"
      ? "badge-success"
      : ev.status === "completed"
        ? "badge-ghost"
        : "badge-primary";

  const statusText =
    ev.status === "ongoing"
      ? "Ongoing"
      : ev.status === "completed"
        ? "Completed"
        : "Upcoming";

  return (
    <div className="card bg-base-100 shadow-xl rounded-2xl border border-base-200">
      <div className="card-body">
        <div className="flex items-center justify-between gap-2">
          <span className="badge badge-outline">{ev.type}</span>
          <span className={`badge ${badgeClass}`}>{statusText}</span>
        </div>

        <h3 className="mt-2 text-lg font-extrabold leading-snug">{ev.title}</h3>

        <div className="mt-3 space-y-2 text-sm text-base-content/70">
          <p>
            📅{" "}
            <span className="font-semibold text-base-content/80">
              {ev.date}
            </span>
          </p>
          <p>⏰ {ev.time}</p>
          <p>📍 {ev.location}</p>
        </div>

        {ev.highlights?.length > 0 && (
          <div className="mt-4 rounded-xl bg-base-200/50 border border-base-200 p-4">
            <p className="font-bold text-sm">Highlights</p>
            <ul className="mt-2 space-y-1 text-sm text-base-content/70 list-disc pl-5">
              {ev.highlights.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between">
          <button className="btn btn-ghost btn-sm rounded-full" type="button">
            Details →
          </button>
          <span className="text-xs text-base-content/50">LifeLine Event</span>
        </div>
      </div>
    </div>
  );
}
