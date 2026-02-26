import React from "react";
import {
  FaEnvelope,
  FaPhone,
  FaFacebook,
  FaGithub,
  FaLinkedin,
  FaMapMarkerAlt,
} from "react-icons/fa";

import sp from "../../assets/sp.jpg";
import tp from "../../assets/tp.jpeg";
import hp from "../../assets/hp.jpeg";
import np from "../../assets/np.jpeg";

export default function ContactPage2() {
  const team = [
    {
      name: "Md. Sajid Ahmed",
      role: "Lead Developer",
      email: "sajidr.u110011@gmail.com",
      phone: "+880 1303315004",
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
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0000] via-[#330000] to-[#000000] text-white relative overflow-hidden">
      {/* animated blur circles */}

      <div className="absolute w-96 h-96 bg-red-600 rounded-full blur-3xl opacity-20 -top-20 -left-20 animate-pulse" />

      <div className="absolute w-96 h-96 bg-red-900 rounded-full blur-3xl opacity-20 bottom-0 right-0 animate-pulse" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
        {/* HEADER */}

        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-red-500 to-red-800 bg-clip-text text-transparent">
            Contact Our Team
          </h1>

          <p className="opacity-80 text-red-200">
            We are here to help and answer any questions
          </p>
        </div>

        {/* TEAM */}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, i) => (
            <div
              key={i}
              className={`backdrop-blur-lg bg-white/5 border border-red-900 rounded-3xl p-6 shadow-xl hover:scale-105 transition duration-500
              
              ${member.main && "ring-2 ring-red-600 scale-105"}
              
              `}
            >
              <img
                src={member.img}
                className="w-18 h-24 rounded-full mx-auto mb-4 border-4 border-red-700"
              />

              <h2 className="text-xl font-bold text-center">{member.name}</h2>

              <p className="text-center text-red-400 mb-3">{member.role}</p>

              <div className="text-sm space-y-1 opacity-80">
                <p className="flex gap-2 items-center">
                  <FaEnvelope /> {member.email}
                </p>

                <p className="flex gap-2 items-center">
                  <FaPhone /> {member.phone}
                </p>
              </div>

              <div className="flex justify-center gap-4 mt-4 text-lg">
                <FaFacebook className="hover:text-red-500 cursor-pointer" />

                <FaGithub className="hover:text-red-400 cursor-pointer" />

                <FaLinkedin className="hover:text-red-300 cursor-pointer" />
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER */}

        <div className="text-center mt-16 opacity-70">
          <p>© 2026 Team LifeLine</p>

          <p className="flex justify-center gap-2 text-red-400">
            <FaMapMarkerAlt />
            Rajshahi, Bangladesh
          </p>
        </div>
      </div>
    </div>
  );
}
