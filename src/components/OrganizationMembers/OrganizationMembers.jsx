import React, { useEffect, useState } from "react";
import { FaEnvelope, FaPhone } from "react-icons/fa";
import sp from "../../assets/sp.jpg";
import tp from "../../assets/tp.jpeg";
import hp from "../../assets/hp.jpeg";
import np from "../../assets/np.jpeg";

export default function OrganizationMembers() {
  const [drops, setDrops] = useState([]);

  // generate floating blood drops
  useEffect(() => {
    const temp = [];
    for (let i = 0; i < 30; i++) {
      temp.push({
        id: i,
        left: Math.random() * 100 + "%",
        size: Math.random() * 12 + 8 + "px",
        delay: Math.random() * 5 + "s",
        duration: Math.random() * 8 + 5 + "s",
      });
    }
    setDrops(temp);
  }, []);
  const members = [
    // Core / main members
    {
      name: "Md. Sajid Ahmed",
      role: "Lead Developer",
      email: "sajidr.u110011@gmail.com",
      phone: "+8801303315004",
      img: sp,
      main: true,
    },
    {
      name: "Tandra Rani Das Banna",
      role: "UI/UX and Frontend Developer",
      email: "tandra@email.com",
      phone: "+880 123456789",
      img: tp,
    },
    {
      name: "Md. Hasibul Islam",
      role: "UI/UX and Backend Developer",
      email: "hasib@email.com",
      phone: "+880 1234567899",
      img: hp,
    },
    {
      name: "Jannatul Baki",
      role: "UI/UX and Frontend Developer",
      email: "jannatulneetu2146@gmail.com",
      phone: "+880 1758448857",
      img: np,
    },

    // General / volunteers / contributors
    {
      name: "Arif Hossain",
      role: "Volunteer",
      email: "arif@email.com",
      phone: "+880123456789",
      img: "https://i.pravatar.cc/300?img=55",
    },
    {
      name: "Farhana Akter",
      role: "Volunteer",
      email: "farhana@email.com",
      phone: "+880123456789",
      img: "https://i.pravatar.cc/300?img=66",
    },
    {
      name: "Rafiqur Rahman",
      role: "Contributor",
      email: "rafiq@email.com",
      phone: "+880123456789",
      img: "https://i.pravatar.cc/300?img=77",
    },
    {
      name: "Shabnam Sultana",
      role: "Contributor",
      email: "shabnam@email.com",
      phone: "+880123456789",
      img: "https://i.pravatar.cc/300?img=88",
    },
    {
      name: "Tanvir Hasan",
      role: "Volunteer",
      email: "tanvir@email.com",
      phone: "+880123456789",
      img: "https://i.pravatar.cc/300?img=99",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0000] via-[#330000] to-black flex flex-col items-center px-4 py-16 relative overflow-hidden">
      {/* Floating blood drops */}
      {drops.map((drop) => (
        <div
          key={drop.id}
          className="absolute bg-red-700 rounded-full opacity-70 animate-drop"
          style={{
            width: drop.size,
            height: drop.size,
            left: drop.left,
            animationDelay: drop.delay,
            animationDuration: drop.duration,
          }}
        />
      ))}
      {/* Extra glows */}
      <div className="absolute w-96 h-96 bg-red-600 rounded-full blur-3xl opacity-20 -top-20 -left-20 animate-pulse" />
      <div className="absolute w-96 h-96 bg-red-900 rounded-full blur-3xl opacity-20 bottom-0 right-0 animate-pulse" />

      {/* Header */}
      <h1 className="text-5xl font-extrabold mb-15 text-center bg-gradient-to-r from-red-500 to-red-800 bg-clip-text text-transparent animate-pulse">
        Organization Members
      </h1>

      {/* Members Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl">
        {members.map((m, idx) => (
          <div
            key={idx}
            className={`relative bg-white/5 backdrop-blur-xl border border-red-900 rounded-3xl p-6 shadow-2xl hover:scale-105 transition-transform duration-500 ${
              m.main ? "ring-2 ring-red-600" : ""
            }`}
          >
            <img
              src={m.img}
              alt={m.name}
              className="w-28 h-28 rounded-full mx-auto border-4 border-red-700 mb-4 shadow-lg"
            />

            <h2 className="text-xl font-bold text-center text-red-300 mb-1">
              {m.name}
            </h2>
            <p className="text-center text-red-500 font-semibold mb-3">
              {m.role}
            </p>

            <div className="flex flex-col gap-2 text-sm text-red-200">
              <p className="flex items-center gap-2">
                <FaEnvelope /> {m.email}
              </p>
              <p className="flex items-center gap-2">
                <FaPhone /> {m.phone}
              </p>
            </div>

            {/* subtle hover effect */}
            <div className="absolute top-0 left-0 w-full h-full rounded-3xl bg-red-700/5 opacity-0 hover:opacity-30 transition-opacity duration-500"></div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center mt-16 text-red-300 opacity-70">
        © 2026 Team LifeLine | Rajshahi, Bangladesh
      </div>
      {/* Tailwind custom animations */}
      <style jsx>{`
        @keyframes drop {
          0% {
            transform: translateY(-20px);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateY(120vh);
            opacity: 0;
          }
        }
        .animate-drop {
          animation-name: drop;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        @keyframes heartbeat {
          0%,
          100% {
            transform: scale(1);
          }
          25% {
            transform: scale(1.05);
          }
          50% {
            transform: scale(1);
          }
          75% {
            transform: scale(1.05);
          }
        }
        .animate-heartbeat {
          animation: heartbeat 1.2s infinite;
        }
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.85;
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s infinite;
        }
      `}</style>
    </div>
  );
}
