import React from "react";
import { Link } from "react-router";

export default function BloodDonationBenefits() {
  const benefits = [
    {
      title: "জীবন বাঁচানো",
      desc: "এক ব্যাগ রক্ত সর্বোচ্চ 3 জন মানুষের জীবন বাঁচাতে পারে।",
      icon: "❤️",
      color: "from-red-500 to-pink-500",
    },
    {
      title: "স্বাস্থ্য পরীক্ষা",
      desc: "রক্তদানের আগে বিনামূল্যে প্রাথমিক স্বাস্থ্য পরীক্ষা করা হয়।",
      icon: "🩺",
      color: "from-blue-500 to-indigo-500",
    },
    {
      title: "হার্ট সুস্থ থাকে",
      desc: "নিয়মিত রক্তদান হৃদরোগের ঝুঁকি কমাতে সাহায্য করে।",
      icon: "💓",
      color: "from-rose-500 to-red-500",
    },
    {
      title: "নতুন রক্তকণিকা তৈরি",
      desc: "রক্তদানের পর শরীর দ্রুত নতুন রক্তকণিকা তৈরি করে।",
      icon: "🧬",
      color: "from-purple-500 to-fuchsia-500",
    },
    {
      title: "মানসিক তৃপ্তি",
      desc: "কারও জীবন বাঁচানোর অনুভূতি মানসিক প্রশান্তি দেয়।",
      icon: "😊",
      color: "from-emerald-500 to-teal-500",
    },
    {
      title: "সামাজিক দায়িত্ব",
      desc: "রক্তদান সমাজের প্রতি একজন মানুষের মানবিক দায়িত্ব।",
      icon: "🤝",
      color: "from-amber-500 to-yellow-500",
    },
  ];

  return (
    <section className="w-full mt-10 bg-gradient-to-br from-[#f0fff9] to-[#ffffff] py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <p className="badge badge-outline">Why Donate Blood?</p>
          <h2 className="mt-3 text-2xl md:text-3xl font-extrabold">
            রক্ত দেওয়ার উপকারিতা
          </h2>
          <p className="mt-2 text-base-content/70">
            রক্তদান শুধু অন্যের জন্য নয়—আপনার নিজের শরীর ও মন দুটোর জন্যই
            উপকারী।
          </p>
        </div>

        {/* Benefit Cards */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {benefits.map((b, i) => (
            <div
              key={i}
              className="card bg-base-100 shadow-xl rounded-2xl border border-base-200"
            >
              <div className="card-body">
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl text-white bg-gradient-to-r ${b.color}`}
                >
                  {b.icon}
                </div>

                <h3 className="mt-4 font-extrabold text-lg">{b.title}</h3>
                <p className="mt-2 text-base-content/70 leading-relaxed">
                  {b.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <p className="text-base-content/70 mb-3">
            আজই রেজিস্ট্রেশন করুন এবং একটি জীবন বাঁচানোর অংশ হন।
          </p>
          <Link to="/regasdonor">
            <button className="btn btn-primary rounded-full px-8">
              Become a Donor
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
