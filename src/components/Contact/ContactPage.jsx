import React from "react";
import {
  FaEnvelope,
  FaPhone,
  FaFacebook,
  FaGithub,
  FaLinkedin,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function UltraPremiumContact() {
  const team = [
    {
      name: "Md. Sajid Ahmed",
      role: "Lead Developer",
      email: "sajid@email.com",
      phone: "+880 123456789",
      img: "https://i.pravatar.cc/300?img=12",
      main: true,
    },
    {
      name: "Tandra Rani Dash Banna",
      role: "UI/UX Designer",
      email: "tandra@email.com",
      phone: "+880 123456789",
      img: "https://i.pravatar.cc/300?img=32",
    },
    {
      name: "Md. Hasibul Islam",
      role: "Backend Developer",
      email: "hasib@email.com",
      phone: "+880 123456789",
      img: "https://i.pravatar.cc/300?img=22",
    },
    {
      name: "Jannatul Baki",
      role: "Support Manager",
      email: "baki@email.com",
      phone: "+880 123456789",
      img: "https://i.pravatar.cc/300?img=45",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] text-white relative overflow-hidden">
      {/* animated blur circles */}

      <div className="absolute w-96 h-96 bg-primary rounded-full blur-3xl opacity-20 -top-20 -left-20 animate-pulse" />
      <div className="absolute w-96 h-96 bg-secondary rounded-full blur-3xl opacity-20 bottom-0 right-0 animate-pulse" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
        {/* HEADER */}

        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Contact Our Team
          </h1>

          <p className="opacity-80">
            We are here to help and answer any questions
          </p>
        </div>

        {/* TEAM */}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, i) => (
            <div
              key={i}
              className={`backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl p-6 shadow-xl hover:scale-105 transition duration-500
              
              ${member.main && "ring-2 ring-primary scale-105"}
              
              `}
            >
              <img
                src={member.img}
                className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white"
              />

              <h2 className="text-xl font-bold text-center">{member.name}</h2>

              <p className="text-center text-primary mb-3">{member.role}</p>

              <div className="text-sm space-y-1 opacity-80">
                <p className="flex gap-2 items-center">
                  <FaEnvelope /> {member.email}
                </p>

                <p className="flex gap-2 items-center">
                  <FaPhone /> {member.phone}
                </p>
              </div>

              <div className="flex justify-center gap-4 mt-4 text-lg">
                <FaFacebook className="hover:text-blue-400 cursor-pointer" />
                <FaGithub className="hover:text-gray-400 cursor-pointer" />
                <FaLinkedin className="hover:text-blue-300 cursor-pointer" />
              </div>
            </div>
          ))}
        </div>

        {/* CONTACT FORM */}

        <div className="grid lg:grid-cols-2 gap-10 mt-20">
          {/* <div className="backdrop-blur-lg bg-white/10 p-8 rounded-3xl border border-white/20">
            <h2 className="text-2xl font-bold mb-6">Send Message</h2>

            <form className="space-y-4">
              <input
                placeholder="Name"
                className="input input-bordered w-full bg-white/10"
              />

              <input
                placeholder="Email"
                className="input input-bordered w-full bg-white/10"
              />

              <textarea
                placeholder="Message"
                className="textarea textarea-bordered w-full bg-white/10 h-32"
              />

              <button className="btn btn-primary w-full text-lg">
                Send Message
              </button>
            </form>
          </div> */}

          {/* MAP */}

          {/* <div className="rounded-3xl overflow-hidden border border-white/20">
            <iframe
              title="map"
              src="https://maps.google.com/maps?q=rajshahi&t=&z=13&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full min-h-[400px]"
            />
          </div> */}
        </div>

        {/* FOOTER */}

        <div className="text-center mt-16 opacity-70">
       

          <p>© 2026 Team LifeLine</p>
             <p className="flex justify-center gap-2">
            <FaMapMarkerAlt />
            Rajshahi, Bangladesh
          </p>
        </div>
      </div>
    </div>
  );
}
