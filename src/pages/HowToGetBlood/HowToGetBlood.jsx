import React, { useMemo, useState } from "react";
import { Link } from "react-router";

export default function HowToGetBlood() {
  const steps = useMemo(
    () => [
      {
        id: 1,
        title: "Register as Donor",
        desc: "Create an account and add your information like blood group, location, and last donation etc.",
        to: "/regasdonor",
        cta: "Register",
        tone: "from-rose-500 to-pink-500",
        soft: "bg-rose-50",
        icon: (
          <svg viewBox="0 0 24 24" className="h-7 w-7">
            <path
              d="M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm2 5h6m-6 4h6m-6 4h4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        ),
      },
      {
        id: 2,
        title: "Find Blood Fast",
        desc: "Search donors by blood group and district/division to reach the right people quickly.",
        to: "/findblood",
        cta: "Find Blood",
        tone: "from-fuchsia-500 to-rose-500",
        soft: "bg-fuchsia-50",
        icon: (
          <svg viewBox="0 0 24 24" className="h-7 w-7">
            <path
              d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11zm0-9a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
      },
      {
        id: 3,
        title: "Connect & Save Lives",
        desc: "Contact donors, confirm availability, and complete donation with care and safety.",
        to: "/feedback",
        cta: "Give your Feedback",
        tone: "from-pink-500 to-red-500",
        soft: "bg-pink-50",
        icon: (
          <svg viewBox="0 0 24 24" className="h-7 w-7">
            <path
              d="M20 7 10 17l-5-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
      },
    ],
    [],
  );

  const [active, setActive] = useState(1);
  const activeStep = steps.find((s) => s.id === active) || steps[0];

  return (
    <section className="w-full bg-gradient-to-b from-white via-rose-50/30 to-white">
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        {/* Header */}
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/70 px-3 py-1 text-xs font-semibold text-rose-600 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-gradient-to-r from-rose-500 to-pink-500" />
              Smart Emergency Flow
            </div>

            <h2 className="mt-3 text-2xl md:text-3xl font-extrabold tracking-tight">
              How to get Blood?
            </h2>

            <p className="mt-2 text-sm md:text-base text-base-content/60">
              3 steps that reduce time during emergencies — fast, verified, and
              simple.
            </p>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-2">
            {steps.map((s) => (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className={[
                  "btn btn-sm rounded-full",
                  active === s.id
                    ? "btn-neutral text-white"
                    : "btn-ghost border border-base-200",
                ].join(" ")}
              >
                Step {s.id}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Area */}
        <div className="relative mt-15">
          {/* <HeartbeatLine tone={activeStep.tone} /> */}

          <div className="grid gap-6 md:gap-10 md:grid-cols-12 items-center">
            <div className="md:col-span-4 md:order-1 order-2 flex md:justify-start justify-center">
              <StepCard
                step={steps[1]}
                active={active === 2}
                onActivate={() => setActive(2)}
                floatDelay="0ms"
              />
            </div>

            <div className="md:col-span-4 md:order-2 order-1 flex md:justify-center justify-center">
              <StepCard
                step={steps[0]}
                active={active === 1}
                onActivate={() => setActive(1)}
                floatDelay="140ms"
              />
            </div>

            <div className="md:col-span-4 md:order-3 order-3 flex md:justify-end justify-center">
              <StepCard
                step={steps[2]}
                active={active === 3}
                onActivate={() => setActive(3)}
                floatDelay="280ms"
              />
            </div>
          </div>

          {/* Details panel (colorful) */}
          <div className="mt-15">
            <div className="relative mx-auto max-w-3xl rounded-xl border-2 border-rose-600 bg-white/70 p-5 md:p-6 shadow-sm backdrop-blur">
              <div
                className={[
                  "absolute -inset-[1px] rounded-3xl opacity-50 blur",
                  "bg-gradient-to-r",
                  activeStep.tone,
                ].join(" ")}
                aria-hidden="true"
              />

              <div className="relative">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-rose-600">
                      ACTIVE STEP
                    </p>
                    <h3 className="mt-1 text-lg md:text-xl font-extrabold">
                      {activeStep.id}. {activeStep.title}
                    </h3>
                    <p className="mt-2 text-sm text-base-content/70">
                      {activeStep.desc}
                    </p>
                    <div className="mt-4">
                      <Link
                        to={activeStep.to}
                        className="btn btn-outline btn-sm rounded-full"
                      >
                        {activeStep.cta} →
                      </Link>
                    </div>
                  </div>

                  <div className="hidden md:block">
                    <span
                      className={[
                        "badge badge-lg font-bold text-white border-0",
                        "bg-gradient-to-r",
                        activeStep.tone,
                      ].join(" ")}
                    >
                      LifeLine
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="badge badge-outline border-rose-100 text-rose-800">
                    Verified donors
                  </span>
                  <span className="badge badge-outline border-rose-100 text-rose-800">
                    Location matching
                  </span>
                  <span className="badge badge-outline border-rose-100 text-rose-800">
                    Fast response
                  </span>
                </div>

                {/* <HeartbeatLine tone={activeStep.tone} /> */}

                {/* mobile pills */}
                <div className="mt-5 flex md:hidden justify-center gap-2">
                  {steps.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setActive(s.id)}
                      className={[
                        "badge badge-lg cursor-pointer border-0 text-white",
                        "bg-gradient-to-r",
                        active === s.id ? s.tone : "from-gray-400 to-gray-500",
                      ].join(" ")}
                    >
                      {s.id}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* local keyframes */}
          <style>{`
            @keyframes floaty {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-12px); }
            }
            @keyframes pulseRing {
              0% { transform: scale(0.92); opacity: .45; }
              70% { transform: scale(1.14); opacity: 0; }
              100% { transform: scale(1.14); opacity: 0; }
            }
            @keyframes drawLine {
              to { stroke-dashoffset: 0; }
            }
            @keyframes shine {
              0% { transform: translateX(-60%) rotate(12deg); }
              100% { transform: translateX(60%) rotate(12deg); }
            }
          `}</style>
        </div>
      </div>
    </section>
  );
}

function StepCard({ step, active, onActivate, floatDelay }) {
  return (
    <button
      type="button"
      onMouseEnter={onActivate}
      onFocus={onActivate}
      onClick={onActivate}
      className="relative text-left focus:outline-none"
      aria-label={`Activate step ${step.id}`}
    >
      <div
        className={[
          "relative rounded-full",
          "w-[270px] h-[270px] md:w-[285px] md:h-[285px]",
          "p-[4px]",
          active ? "shadow-2xl" : "shadow-md opacity-90",
          "transition-all duration-300",
        ].join(" ")}
        style={{
          animation: `floaty 3.8s ease-in-out infinite`,
          animationDelay: floatDelay,
        }}
      >
        {/* gradient border */}
        <div
          className={[
            "absolute inset-0 rounded-full bg-gradient-to-r",
            step.tone,
          ].join(" ")}
        />

        {/* inner glass card */}
        <div
          className={[
            "relative h-full w-full rounded-full border border-white/50",
            "bg-white/75 backdrop-blur",
            "grid place-items-center px-8",
          ].join(" ")}
        >
          {/* subtle shine */}
          <span
            className="pointer-events-none absolute -left-1/2 top-0 h-full w-1/2 bg-white/20 blur-xl"
            style={{ animation: active ? "shine 1.2s ease-in-out" : "none" }}
          />

          {/* pulse ring */}
          {active && (
            <span
              className={[
                "absolute inset-0 rounded-full border",
                "border-rose-300/60",
              ].join(" ")}
              style={{ animation: "pulseRing 1.6s ease-out infinite" }}
            />
          )}

          {/* step number bubble */}
          <div className="absolute -top-3 -left-3">
            <div className="h-12 w-12 rounded-full bg-white border border-base-200 shadow grid place-items-center">
              <span className="text-lg font-extrabold text-rose-600">
                {step.id}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center text-center">
            {/* icon holder */}
            <div
              className={[
                "h-14 w-14 rounded-2xl grid place-items-center text-white",
                "bg-gradient-to-r",
                step.tone,
                "shadow",
                "transition-all duration-300",
                active ? "scale-[1.04]" : "scale-100",
              ].join(" ")}
            >
              {step.icon}
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-extrabold">{step.title}</h3>
              <p className="mt-2 text-sm text-base-content/70 leading-relaxed">
                {step.desc}
              </p>

              <div className="mt-5 flex justify-center">
                <span
                  className={[
                    "badge border-0 text-white",
                    "bg-gradient-to-r",
                    active ? step.tone : "from-gray-400 to-gray-500",
                  ].join(" ")}
                >
                  {active ? "Active" : "Hover / Click"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

// function HeartbeatLine({ tone }) {
//   return (
//     <div className="pointer-events-none absolute inset-x-0 top-[55%] md:top-[60%] -z-10">
//       <div className="mx-auto max-w-6xl px-4">
//         <div className="relative flex justify-center">
//           <svg
//             className="w-full max-w-3xl opacity-95"
//             viewBox="0 0 900 140"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               d="M20 90 C 60 90, 90 30, 120 90 S 180 150, 220 90
//                  S 290 30, 320 90 S 380 150, 420 90
//                  S 480 30, 510 90 S 570 150, 600 90
//                  S 660 30, 690 90 S 750 150, 780 90
//                  S 840 30, 880 90"
//               stroke="url(#grad)"
//               strokeWidth="7"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeDasharray="1600"
//               strokeDashoffset="1600"
//               style={{ animation: "drawLine 1.2s ease-out forwards" }}
//             />

//             <path
//               d="M455 92c-18-20-55-8-55 18 0 29 55 56 55 56s55-27 55-56c0-26-37-38-55-18z"
//               fill="url(#grad)"
//             />

//             <defs>
//               <linearGradient id="grad" x1="0" y1="0" x2="900" y2="0">
//                 {/* tone অনুযায়ী gradient */}
//                 <stop offset="0%" stopColor="#fb7185" />
//                 <stop offset="50%" stopColor="#ec4899" />
//                 <stop offset="100%" stopColor="#ef4444" />
//               </linearGradient>
//             </defs>
//           </svg>
//         </div>
//       </div>
//     </div>
//   );
// }
