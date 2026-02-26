// import React, { useState, useEffect } from "react";
// import { FaEnvelopeOpenText } from "react-icons/fa";

// export default function ApplyNow() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [contact, setContact] = useState("");
//   const [position, setPosition] = useState("");
//   const [drops, setDrops] = useState([]);

//   // generate floating blood drops
//   useEffect(() => {
//     const temp = [];
//     for (let i = 0; i < 30; i++) {
//       temp.push({
//         id: i,
//         left: Math.random() * 100 + "%",
//         size: Math.random() * 12 + 8 + "px",
//         delay: Math.random() * 5 + "s",
//         duration: Math.random() * 8 + 5 + "s",
//       });
//     }
//     setDrops(temp);
//   }, []);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!name || !email || !contact || !position) {
//       return alert("Please fill all the fields!");
//     }

//     const toEmail = "sajidr.u110011@gmail.com";
//     const subject = `Job Application for ${position}`;
//     const body = `
// Name: ${name}
// Email: ${email}
// Contact Number: ${contact}
// Position: ${position}

// Please find my CV attached manually before sending.
//     `;
//     const mailtoLink = `mailto:${toEmail}?subject=${encodeURIComponent(
//       subject,
//     )}&body=${encodeURIComponent(body)}`;

//     window.location.href = mailtoLink;
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#1a0000] via-[#330000] to-black flex items-center justify-center px-4 relative overflow-hidden">
//       {/* Floating blood drops */}
//       {drops.map((drop) => (
//         <div
//           key={drop.id}
//           className="absolute bg-red-700 rounded-full opacity-70 animate-drop"
//           style={{
//             width: drop.size,
//             height: drop.size,
//             left: drop.left,
//             animationDelay: drop.delay,
//             animationDuration: drop.duration,
//           }}
//         />
//       ))}

//       {/* Glass card */}
//       <div className="relative z-10 max-w-xl w-full bg-white/5 backdrop-blur-xl border border-red-900 rounded-3xl p-10 shadow-2xl animate-pulse-slow">
//         <h2 className="text-3xl font-extrabold mb-6 text-center bg-gradient-to-r from-red-500 to-red-800 bg-clip-text text-transparent animate-pulse">
//           Apply for Job
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-5">
//           <input
//             type="text"
//             placeholder="Your Name"
//             className="input input-bordered w-full bg-white/10 text-white border-red-700 placeholder-red-300 focus:border-red-500 focus:ring-red-500"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             required
//           />

//           <input
//             type="email"
//             placeholder="Your Email"
//             className="input input-bordered w-full bg-white/10 text-white border-red-700 placeholder-red-300 focus:border-red-500 focus:ring-red-500"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />

//           <input
//             type="text"
//             placeholder="Contact Number"
//             className="input input-bordered w-full bg-white/10 text-white border-red-700 placeholder-red-300 focus:border-red-500 focus:ring-red-500"
//             value={contact}
//             onChange={(e) => setContact(e.target.value)}
//             required
//           />

//           <select
//             className="select select-bordered w-full bg-white/10 text-white border-red-700 placeholder-red-300 focus:border-red-500 focus:ring-red-500"
//             value={position}
//             onChange={(e) => setPosition(e.target.value)}
//             required
//           >
//             <option value="">Select Position</option>
//             <option>Blood Donation Volunteer</option>
//             <option>Campus Ambassador</option>
//             <option>Frontend Developer</option>
//             <option>Backend Developer</option>
//           </select>

//           <div className="text-sm text-red-300">
//             ⚠️ After clicking submit, your email app will open. Please attach
//             your CV manually before sending.
//           </div>

//           <button
//             type="submit"
//             className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-red-600 to-red-900 hover:from-red-500 hover:to-red-800 flex items-center justify-center gap-3 shadow-lg shadow-red-900/50 animate-heartbeat transition duration-500"
//           >
//             <FaEnvelopeOpenText /> Continue to Email
//           </button>
//         </form>
//       </div>

//       {/* Extra red glows */}
//       <div className="absolute w-96 h-96 bg-red-600 rounded-full blur-3xl opacity-20 -top-20 -left-20 animate-pulse" />
//       <div className="absolute w-96 h-96 bg-red-900 rounded-full blur-3xl opacity-20 bottom-0 right-0 animate-pulse" />

//       {/* Tailwind custom animations */}
//       <style jsx>{`
//         @keyframes drop {
//           0% {
//             transform: translateY(-20px);
//             opacity: 0;
//           }
//           50% {
//             opacity: 1;
//           }
//           100% {
//             transform: translateY(120vh);
//             opacity: 0;
//           }
//         }
//         .animate-drop {
//           animation-name: drop;
//           animation-timing-function: linear;
//           animation-iteration-count: infinite;
//         }
//         @keyframes heartbeat {
//           0%,
//           100% {
//             transform: scale(1);
//           }
//           25% {
//             transform: scale(1.05);
//           }
//           50% {
//             transform: scale(1);
//           }
//           75% {
//             transform: scale(1.05);
//           }
//         }
//         .animate-heartbeat {
//           animation: heartbeat 1.2s infinite;
//         }
//         @keyframes pulse-slow {
//           0%,
//           100% {
//             opacity: 1;
//           }
//           50% {
//             opacity: 0.85;
//           }
//         }
//         .animate-pulse-slow {
//           animation: pulse-slow 3s infinite;
//         }
//       `}</style>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { FaEnvelopeOpenText } from "react-icons/fa";

export default function ApplyNow() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [position, setPosition] = useState("");
  const [drops, setDrops] = useState([]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !contact || !position) {
      return alert("Please fill all the fields!");
    }

    const toEmail = "sajidr.u110011@gmail.com";
    const subject = `Job Application for ${position}`;
    const body = `Name: ${name}
Email: ${email}
Contact Number: ${contact}
Position: ${position}

Please find my CV attached manually before sending.`;

    //Gmail web compose (works in browser)
    const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      toEmail,
    )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // open in new tab (better UX)
    window.open(gmailLink, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0000] via-[#330000] to-black flex items-center justify-center px-4 relative overflow-hidden">
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

      <div className="relative z-10 max-w-xl w-full bg-white/5 backdrop-blur-xl border border-red-900 rounded-3xl p-10 shadow-2xl animate-pulse-slow">
        <h2 className="text-3xl font-extrabold mb-6 text-center bg-gradient-to-r from-red-500 to-red-800 bg-clip-text text-transparent animate-pulse">
          Apply for Job
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Your Name"
            className="input input-bordered w-full bg-white/10 text-white border-red-700 placeholder-red-300 focus:border-red-500 focus:ring-red-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Your Email"
            className="input input-bordered w-full bg-white/10 text-white border-red-700 placeholder-red-300 focus:border-red-500 focus:ring-red-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Contact Number"
            className="input input-bordered w-full bg-white/10 text-white border-red-700 placeholder-red-300 focus:border-red-500 focus:ring-red-500"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            required
          />

          <select
            className="select select-bordered w-full bg-white/10 text-white border-red-700 placeholder-red-300 focus:border-red-500 focus:ring-red-500"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            required
          >
            <option value="" className="text-black bg-white">
              Select Position
            </option>

            <option className="text-black bg-white">
              Blood Donation Volunteer
            </option>
            <option className="text-black bg-white">Campus Ambassador</option>
            <option className="text-black bg-white">Frontend Developer</option>
            <option className="text-black bg-white">Backend Developer</option>
          </select>

          <div className="text-sm text-red-300">
            ⚠️ After clicking submit, Gmail will open in a new tab. Please
            attach your CV manually before sending.
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-xl text-white font-bold text-lg bg-gradient-to-r from-red-600 to-red-900 hover:from-red-500 hover:to-red-800 flex items-center justify-center gap-3 shadow-lg shadow-red-900/50 animate-heartbeat transition duration-500"
          >
            <FaEnvelopeOpenText /> Continue to Gmail
          </button>
        </form>
      </div>

      <div className="absolute w-96 h-96 bg-red-600 rounded-full blur-3xl opacity-20 -top-20 -left-20 animate-pulse" />
      <div className="absolute w-96 h-96 bg-red-900 rounded-full blur-3xl opacity-20 bottom-0 right-0 animate-pulse" />

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
