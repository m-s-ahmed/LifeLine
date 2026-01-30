import React from "react";

export default function BloodDonationAwareness() {
  const points = [
    {
      title: "পর্যাপ্ত ঘুম",
      desc: "রক্ত দেওয়ার আগের রাতে অন্তত 6–8 ঘণ্টা ঘুমানো জরুরি।",
      icon: "😴",
      color: "from-indigo-500 to-purple-500",
    },
    {
      title: "হালকা খাবার খান",
      desc: "রক্ত দেওয়ার আগে ভারী বা তেলযুক্ত খাবার এড়িয়ে চলুন।",
      icon: "🥗",
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "পানি পান করুন",
      desc: "রক্ত দেওয়ার আগে ও পরে পর্যাপ্ত পানি পান করুন।",
      icon: "💧",
      color: "from-sky-500 to-cyan-500",
    },
    {
      title: "অসুস্থ হলে রক্ত দেবেন না",
      desc: "জ্বর, সর্দি বা সংক্রমণ থাকলে রক্তদান স্থগিত রাখুন।",
      icon: "🤒",
      color: "from-rose-500 to-pink-500",
    },
    {
      title: "শেষ রক্তদানের সময় মনে রাখুন",
      desc: "পুরুষ: 3 মাস, নারী: 4 মাস বিরতি থাকা প্রয়োজন।",
      icon: "📅",
      color: "from-amber-500 to-orange-500",
    },
    {
      title: "সঠিক তথ্য দিন",
      desc: "নিজের স্বাস্থ্য সংক্রান্ত তথ্য সৎভাবে প্রদান করুন।",
      icon: "🛡️",
      color: "from-teal-500 to-lime-500",
    },
  ];

  return (
    <section className="w-full mt-10 bg-gradient-to-br from-[#fff5f7] to-[#fefefe] py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <p className="badge badge-outline">Blood Donation Awareness</p>
          <h2 className="mt-3 text-2xl md:text-3xl font-extrabold">
            রক্ত দেওয়ার আগে যা জানা জরুরি
          </h2>
          <p className="mt-2 text-base-content/70">
            নিরাপদ ও সুস্থ রক্তদানের জন্য নিচের নির্দেশনাগুলো মেনে চলা অত্যন্ত
            গুরুত্বপূর্ণ।
          </p>
        </div>

        {/* Cards */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {points.map((p, i) => (
            <div
              key={i}
              className="card bg-base-100 shadow-xl rounded-2xl border border-base-200 overflow-hidden"
            >
              <div className={`h-2 bg-gradient-to-r ${p.color}`} />
              <div className="card-body">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-xl text-white bg-gradient-to-r ${p.color}`}
                  >
                    {p.icon}
                  </div>
                  <h3 className="font-extrabold text-lg">{p.title}</h3>
                </div>
                <p className="mt-3 text-base-content/70 leading-relaxed">
                  {p.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-8 text-center text-sm text-base-content/60">
          ⚠️ প্রয়োজনে চিকিৎসকের পরামর্শ নিন এবং নিরাপদ রক্তদানে সচেতন থাকুন।
        </div>
      </div>
    </section>
  );
}
