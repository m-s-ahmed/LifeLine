import React, { useEffect, useRef, useState } from "react";

export default function Collaborators() {
  const trackRef = useRef(null);
  const [items, setItems] = useState([]);
  const [active, setActive] = useState(1);

  // Load JSON from public
  useEffect(() => {
    fetch("/collaborators.json")
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
        setActive(Math.min(1, Math.max(0, data.length - 1)));
      })
      .catch(() => setItems([]));
  }, []);

  // Detect active card on scroll (center focused)
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const onScroll = () => {
      const children = Array.from(el.children);
      const mid = el.scrollLeft + el.clientWidth / 2;

      let bestIdx = 0;
      let bestDist = Infinity;

      children.forEach((child, idx) => {
        const childMid = child.offsetLeft + child.clientWidth / 2;
        const dist = Math.abs(childMid - mid);
        if (dist < bestDist) {
          bestDist = dist;
          bestIdx = idx;
        }
      });

      setActive(bestIdx);
    };

    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [items]);

  const scrollToIndex = (idx) => {
    const el = trackRef.current;
    if (!el) return;
    const child = el.children[idx];
    if (!child) return;

    el.scrollTo({
      left: child.offsetLeft - (el.clientWidth - child.clientWidth) / 2,
      behavior: "smooth",
    });
  };

  // If any items not have
  if (!items.length) {
    return (
      <section className="w-full bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
          <h2 className="text-xl font-semibold md:text-2xl">
            Our Collaborators
          </h2>
          <div className="mt-6 rounded-2xl border border-base-200 p-6 text-base-content/70">
            Loading collaborators...
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full mt-10  shadow-sm">
      <div>
        {/* Our Collaborators */}
        <div>
          <div className="text-center">
            <h1 className=" p-5 text-4xl font-bold md:text-4xl">
              Our Collaborators
            </h1>
            <p className="mt-1 text-sm text-base-content/60">
              Partners who help with blood drives & emergency response.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 py-5 md:py-5">
          {/* Slider part */}
          <div className="mt-6">
            <div
              ref={trackRef}
              className="
              flex gap-6 overflow-x-auto scroll-smooth pb-6
              [scrollbar-width:none] [-ms-overflow-style:none]
              snap-x snap-mandatory
            "
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              <style>{`div::-webkit-scrollbar{display:none;}`}</style>

              {items.map((c, idx) => {
                const isActive = idx === active;

                return (
                  <div key={c.id} className="snap-center shrink-0">
                    <div
                      className={[
                        "card bg-base-100 border border-base-200 rounded-2xl",
                        "w-[82vw] sm:w-[60vw] md:w-[340px]",
                        "transition-all duration-300",
                        isActive
                          ? "shadow-xl -translate-y-1"
                          : "shadow-sm opacity-70",
                      ].join(" ")}
                    >
                      <div className="card-body p-5 md:p-6">
                        <div className="flex items-start gap-4">
                          <div className="avatar">
                            <div className="w-14 h-14 rounded-xl bg-base-200">
                              <img
                                src={c.logo}
                                alt={c.name}
                                onError={(e) => {
                                  e.currentTarget.src =
                                    "/logos/placeholder.png";
                                }}
                              />
                            </div>
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-lg font-bold truncate">
                                {c.name}
                              </h3>
                              <span
                                className={`badge ${c.accent || "badge-neutral"} badge-sm font-bold`}
                              >
                                Partner
                              </span>
                            </div>
                            <p className="text-sm text-base-content/70 truncate">
                              {c.fullName}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 space-y-2">
                          <p className="text-sm">
                            <span className="font-semibold">Role:</span>{" "}
                            <span className="text-base-content/70">
                              {c.role}
                            </span>
                          </p>
                          <p className="text-sm">
                            <span className="font-semibold">Location:</span>{" "}
                            <span className="text-base-content/70">
                              {c.location}
                            </span>
                          </p>
                        </div>

                        <div className="mt-4 flex items-center justify-between gap-2">
                          <a
                            className="btn btn-sm btn-outline"
                            href={c.website}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Visit
                          </a>

                          <button className="btn btn-sm btn-primary">
                            Contact
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Dots */}
            <div className="mt-1 flex items-center justify-center gap-2">
              {items.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => scrollToIndex(idx)}
                  className={[
                    "h-2 w-2 rounded-full transition-all",
                    idx === active ? "bg-neutral w-5" : "bg-neutral/30",
                  ].join(" ")}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Desktop quick nav */}
          <div className="hidden md:flex justify-center items-center gap-2 p-5">
            <button
              className="btn btn-sm btn-outline"
              onClick={() => scrollToIndex(Math.max(0, active - 1))}
            >
              Prev
            </button>
            <button
              className="btn btn-sm btn-outline"
              onClick={() =>
                scrollToIndex(Math.min(items.length - 1, active + 1))
              }
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
