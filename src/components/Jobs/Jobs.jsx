import React from "react";
import {
  FaHeartbeat,
  FaMapMarkerAlt,
  FaClock,
  FaUserPlus,
} from "react-icons/fa";
import { Link } from "react-router";

// Blood red gradient theme
// ✔ Glassmorphism card
// ✔ Glow effect
// ✔ Premium Apply button
// ✔ Background animation
// ✔ NGO / Blood donation vibe
// ✔ Fully responsive

export default function Jobs() {
  const jobs = [
    {
      title: "Blood Donation Volunteer",
      type: "Volunteer",
      location: "All Bangladesh",
      salary: "Honorary",
      icon: <FaHeartbeat />,
      desc: "Help save lives by managing blood donors and supporting emergency requests.",
    },
    {
      title: "Campus Ambassador",
      type: "Part Time",
      location: "University Based",
      salary: "Certificate + Rewards",
      icon: <FaHeartbeat />,
      desc: "Promote blood donation awareness and recruit donors in your campus.",
    },
    {
      title: "Blood Collection Coordinator",
      type: "Full Time",
      location: "Rajshahi",
      salary: "15k - 25k BDT",
      icon: <FaHeartbeat />,
      desc: "Coordinate between hospitals, donors, and recipients.",
    },
    {
      title: "Frontend Developer",
      type: "Remote",
      location: "Anywhere",
      salary: "20k - 40k BDT",
      icon: <FaHeartbeat />,
      desc: "Build and maintain the blood donation platform interface.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2b0000] via-[#3d0000] to-black text-white relative overflow-hidden">
      {/* background glow */}

      <div className="absolute w-96 h-96 bg-red-600 rounded-full blur-3xl opacity-20 top-0 left-0 animate-pulse" />
      <div className="absolute w-96 h-96 bg-red-800 rounded-full blur-3xl opacity-20 bottom-0 right-0 animate-pulse" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
        {/* header */}

        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
            Join Our Life Saving Mission
          </h1>

          <p className="text-red-200 max-w-xl mx-auto">
            Every role here contributes to saving human lives. Become part of
            our blood donation team.
          </p>
        </div>

        {/* jobs grid */}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {jobs.map((job, index) => (
            <div
              key={index}
              className="group backdrop-blur-xl bg-white/5 border border-red-900 rounded-3xl p-6 shadow-2xl hover:shadow-red-900/50 hover:-translate-y-2 transition duration-500"
            >
              {/* icon */}

              <div className="text-4xl text-red-500 mb-4 group-hover:scale-125 transition">
                {job.icon}
              </div>

              {/* title */}

              <h2 className="text-xl font-bold mb-2">{job.title}</h2>

              {/* desc */}

              <p className="text-red-200 text-sm mb-4">{job.desc}</p>

              {/* info */}

              <p className="flex items-center gap-2 text-sm mb-2 text-red-300">
                <FaClock /> {job.type}
              </p>

              <p className="flex items-center gap-2 text-sm mb-2 text-red-300">
                <FaMapMarkerAlt /> {job.location}
              </p>

              <p className="text-red-400 font-semibold mb-6">{job.salary}</p>

              {/* apply button */}

              <Link to="/apply">
                {" "}
                <button className="w-full py-3 rounded-xl font-bold bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 transition flex items-center justify-center gap-2 shadow-lg shadow-red-900/40">
                  <FaUserPlus />
                  Apply Now
                </button>
              </Link>
            </div>
          ))}
        </div>

        {/* footer quote */}

        <div className="text-center mt-20">
          <p className="text-red-400 text-lg italic">
            "Donate Blood, Save Life — Join Our Team"
          </p>
        </div>
      </div>
    </div>
  );
}
