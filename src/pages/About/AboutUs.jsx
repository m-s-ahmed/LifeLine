import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function AboutUs() {
  const API = import.meta.env.VITE_API_URL;

  const [liveStats, setLiveStats] = useState({
    donorsCount: null,
    districtCoverage: null,
    feedbackCount: null,
  });

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch(`${API}/api/stats/public`);
        const data = await res.json().catch(() => ({}));
        if (res.ok) {
          setLiveStats({
            donorsCount: Number(data.donorsCount ?? 0),
            districtCoverage: Number(data.districtCoverage ?? 0),
            feedbackCount: Number(data.feedbackCount ?? 0),
          });
        }
      } catch (e) {
        // silent fail (UI fallback)
        console.log(e);
      }
    };

    if (API) run();
  }, [API]);

  const stats = [
    {
      label: "Registered Donors",
      value: liveStats.donorsCount === null ? "—" : `${liveStats.donorsCount}+`,
    },
    {
      label: "District Coverage",
      value:
        liveStats.districtCoverage === null
          ? "—"
          : `${liveStats.districtCoverage}+`,
    },
    {
      label: "Feedback Received",
      value:
        liveStats.feedbackCount === null ? "—" : `${liveStats.feedbackCount}+`,
    },
    { label: "Emergency Support", value: "24/7" },
  ];

  const values = [
    {
      title: "Trust & Safety",
      desc: "Verified sign-in, responsible data handling, and user-first safety practices.",
    },
    {
      title: "Speed Matters",
      desc: "In emergencies, time is life. We focus on fast discovery and quick communication.",
    },
    {
      title: "Community Driven",
      desc: "Built to empower donors, volunteers, and organizations to help together.",
    },
    {
      title: "Simplicity",
      desc: "Easy registration, simple search, and clean profiles—so anyone can use it.",
    },
  ];

  const steps = [
    {
      no: "01",
      title: "Register as Donor",
      desc: "Create an account and add your blood group, location, and last donation info.",
      to: "/regasdonor",
      cta: "Register",
    },
    {
      no: "02",
      title: "Find Blood Fast",
      desc: "Search donors by blood group and district/division to reach the right people quickly.",
      to: "/findblood",
      cta: "Find Blood",
    },
    {
      no: "03",
      title: "Connect & Save Lives",
      desc: "Contact donors, confirm availability, and complete donation with care and safety.",
      to: "/feedback", //give feedback route
      cta: "Give your Feedback",
    },
  ];

  const faqs = [
    {
      q: "LifeLine কী?",
      a: "LifeLine হলো একটি blood donation & emergency support platform—যেখানে দ্রুত ডোনার খুঁজে পাওয়া, রক্তের জন্য গাইডলাইন দেখা এবং সহায়তা পাওয়ার পথ সহজ করা হয়।",
    },
    {
      q: "ডোনার তথ্য কি নিরাপদ?",
      a: "আমরা token-based authentication ব্যবহার করি এবং শুধুমাত্র প্রয়োজনীয় তথ্য সংগ্রহ করি। ভবিষ্যতে privacy controls আরও উন্নত করা হবে।",
    },
    {
      q: "কিভাবে ডোনার খুঁজবো?",
      a: "Find Blood পেজে গিয়ে blood group, district/division দিয়ে filter করে উপযুক্ত ডোনার খুঁজে নিতে পারবে।",
    },
    {
      q: "আমি কি Organization হিসেবে যুক্ত হতে পারবো?",
      a: "হ্যাঁ, Register As Organization route আছে। ভবিষ্যতে organization verification এবং dashboard যুক্ত করা হবে।",
    },
  ];

  return (
    <div className="min-h-screen bg-base-200/40">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#4b0c2a] via-[#7a0f3a] to-[#c21d4b] opacity-95" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 md:py-20 text-white">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 items-center">
            <div>
              <p className="badge badge-outline text-white/90 border-white/30">
                LifeLine • Smart Blood Donation Platform
              </p>

              <h1 className="mt-4 text-3xl md:text-5xl font-extrabold leading-tight">
                Rapid Blood Matching,
                <br />
                Real Community Impact.
              </h1>

              <p className="mt-4 text-white/85 text-base md:text-lg leading-relaxed">
                LifeLine তৈরি করা হয়েছে জরুরি সময়ে দ্রুত রক্তদাতা খুঁজে পাওয়া,
                সঠিক তথ্য জানা, এবং যোগাযোগ সহজ করার জন্য। সময় বাঁচলে জীবন
                বাঁচে— আমরা সেই জায়গাটাকে সহজ করতে চাই।
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  to="/findblood"
                  className="btn btn-neutral rounded-full px-6"
                >
                  Find Blood
                </Link>
                <Link
                  to="/regasdonor"
                  className="btn btn-outline rounded-full px-6 text-white border-white/40 hover:border-white"
                >
                  Register as Donor
                </Link>
              </div>

              <div className="mt-6 text-sm text-white/75">
                🔒 Secure sign-in • ⚡ Fast search • 🤝 Community-first
              </div>
            </div>

            {/* Mission Card */}
            <div className="md:justify-self-end">
              <div className="card bg-base-100 text-base-content shadow-2xl rounded-2xl">
                <div className="card-body">
                  <h2 className="card-title text-xl md:text-2xl">
                    Our Mission
                  </h2>
                  <p className="text-base-content/70 leading-relaxed">
                    To make blood discovery and emergency response easier,
                    faster, and more reliable—so no one loses a life due to late
                    support.
                  </p>

                  <div className="divider my-2" />

                  <h3 className="font-bold">We focus on:</h3>
                  <ul className="list-disc pl-5 text-base-content/70 space-y-1">
                    <li>Donor discovery by location & blood group</li>
                    <li>Secure authentication & safe access</li>
                    <li>Simple profile and clean workflow</li>
                    <li>Continuous improvement from real feedback</li>
                  </ul>

                  <div className="mt-3">
                    <Link
                      to="/random"
                      className="link link-primary font-semibold"
                    >
                      How to Get Blood →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* STATS */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur px-5 py-4"
              >
                <div className="text-2xl md:text-3xl font-extrabold">
                  {s.value}
                </div>
                <div className="text-sm text-white/80 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VISION + WHY */}
      <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          <div className="card bg-base-100 shadow-xl rounded-2xl">
            <div className="card-body">
              <h2 className="card-title text-2xl">Our Vision</h2>
              <p className="text-base-content/70 leading-relaxed">
                A future where every person can access the right blood donor
                quickly, safely, and confidently—no matter where they live.
              </p>

              <div className="mt-4 rounded-xl bg-base-200/60 p-4">
                <p className="font-semibold">Bangladesh context</p>
                <p className="text-sm text-base-content/70 mt-1">
                  জরুরি সময়ে রক্ত পাওয়া অনেক সময় কঠিন হয়। LifeLine ডোনার ডাটাকে
                  সংগঠিত করে দ্রুত খুঁজে পাওয়ার সুযোগ দেয়।
                </p>
              </div>

              <div className="mt-4">
                <Link to="/regasorganization" className="btn btn-ghost btn-sm">
                  Register as Organization →
                </Link>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl rounded-2xl">
            <div className="card-body">
              <h2 className="card-title text-2xl">Why LifeLine?</h2>
              <p className="text-base-content/70 leading-relaxed">
                Donor information often stays scattered across groups and posts.
                LifeLine centralizes donors and provides structured search &
                guidance.
              </p>

              <div className="mt-4">
                <h3 className="font-bold">What makes it different:</h3>
                <ul className="mt-2 space-y-2 text-base-content/70">
                  <li>✅ Firebase Authentication (secure sign-in)</li>
                  <li>✅ MongoDB profiles (rich donor data)</li>
                  <li>✅ Simple UI for quick access</li>
                  <li>✅ Extensible for organizations & admins</li>
                </ul>
              </div>

              <div className="mt-4">
                <Link to="/findblood" className="btn btn-primary btn-sm">
                  Search Donors
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="mx-auto max-w-6xl px-4 pb-12 md:pb-16">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold">
            Our Core Values
          </h2>
          <p className="text-base-content/70 mt-2">
            We build with responsibility, speed, and community trust.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {values.map((v) => (
            <div key={v.title} className="card bg-base-100 shadow rounded-2xl">
              <div className="card-body">
                <h3 className="font-bold text-lg">{v.title}</h3>
                <p className="text-base-content/70">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-6xl px-4 pb-12 md:pb-16">
        <div className="card bg-base-100 shadow-xl rounded-2xl overflow-hidden">
          <div className="bg-base-200/60 px-6 py-5">
            <h2 className="text-2xl md:text-3xl font-extrabold">
              How It Works
            </h2>
            <p className="text-base-content/70 mt-1">
              ৩টি সহজ ধাপে রক্তদাতা খুঁজে পাওয়া এবং সহায়তা করা।
            </p>
          </div>

          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {steps.map((s) => (
                <div
                  key={s.no}
                  className="rounded-2xl border border-base-200 p-5"
                >
                  <div className="text-sm font-bold text-primary">{s.no}</div>
                  <div className="mt-2 text-lg font-extrabold">{s.title}</div>
                  <p className="mt-2 text-base-content/70">{s.desc}</p>
                  <div className="mt-4">
                    <Link
                      to={s.to}
                      className="btn btn-outline btn-sm rounded-full"
                    >
                      {s.cta} →
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/findblood"
                className="btn btn-primary rounded-full px-6"
              >
                Start Searching
              </Link>
              <Link
                to="/regasdonor"
                className="btn btn-ghost rounded-full px-6"
              >
                Become a Donor
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-6xl px-4 pb-14 md:pb-20">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold">FAQ</h2>
          <p className="text-base-content/70 mt-2">
            Common questions about LifeLine.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqs.map((f) => (
            <div
              key={f.q}
              className="collapse collapse-arrow bg-base-100 shadow rounded-2xl"
            >
              <input type="radio" name="about_faq" />
              <div className="collapse-title text-lg font-bold">{f.q}</div>
              <div className="collapse-content">
                <p className="text-base-content/70">{f.a}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 rounded-2xl bg-gradient-to-r from-[#4b0c2a] via-[#7a0f3a] to-[#c21d4b] p-7 md:p-10 text-white">
          <h3 className="text-2xl md:text-3xl font-extrabold">
            Let’s build a life-saving community together.
          </h3>
          <p className="mt-2 text-white/85 max-w-2xl">
            If you’re a donor, volunteer, or organization—LifeLine welcomes you.
            Register today and help someone when it matters the most.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/regasdonor"
              className="btn btn-neutral rounded-full px-6"
            >
              Register Now
            </Link>
            <Link
              to="/random"
              className="btn btn-outline rounded-full px-6 text-white border-white/40"
            >
              Learn the Process
            </Link>
          </div>

          <p className="mt-4 text-xs text-white/70">
            Note: This platform supports responsible blood donation. Always
            follow medical advice and local guidelines.
          </p>
        </div>
      </section>
    </div>
  );
}
