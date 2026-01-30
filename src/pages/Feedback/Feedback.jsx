import React, { useEffect, useState } from "react";

export default function Feedback() {
  const API = import.meta.env.VITE_API_URL;

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    rating: 0,
    message: "",
  });

  const [toast, setToast] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  const loadRecent = async () => {
    try {
      const res = await fetch(`${API}/api/feedback/public?limit=6`);
      const data = await res.json();
      if (res.ok) setRecent(data);
    } catch {}
  };

  useEffect(() => {
    loadRecent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const setRating = (v) => setForm((p) => ({ ...p, rating: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.message.trim() || form.message.trim().length < 5) {
      setToast({ type: "error", message: "Write at least 5 characters." });
      return;
    }

    try {
      setSubmitting(true);

      const res = await fetch(`${API}/api/feedback`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) throw new Error(data?.message || "Feedback submit failed");

      setToast({
        type: "success",
        message: "Thank you! Feedback submitted ✅",
      });
      setForm({ name: "", email: "", role: "", rating: 0, message: "" });

      await loadRecent();
    } catch (err) {
      setToast({ type: "error", message: err.message || "Submit failed" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200/40 py-10 md:py-14">
      {toast && (
        <div className="toast toast-top toast-end z-50">
          <div
            className={`alert ${toast.type === "success" ? "alert-success" : "alert-error"} shadow-lg`}
          >
            <span className="text-sm font-semibold">{toast.message}</span>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-5xl px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form */}
          <div className="lg:col-span-7">
            <div className="card bg-base-100 shadow-2xl rounded-2xl border border-base-200 overflow-hidden">
              <div className="bg-gradient-to-r from-[#4b0c2a] via-[#7a0f3a] to-[#c21d4b] px-6 py-6">
                <h1 className="text-xl md:text-2xl font-extrabold text-white">
                  Give Your Feedback
                </h1>
                <p className="mt-1 text-white/80 text-sm">
                  Your feedback helps LifeLine improve and save more lives.
                </p>
              </div>

              <div className="card-body px-5 py-7 md:px-8 md:py-9">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="label">
                        <span className="label-text font-semibold">Name</span>
                      </label>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        className="input input-bordered w-full rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="label">
                        <span className="label-text font-semibold">
                          Email (optional)
                        </span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className="input input-bordered w-full rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="label">
                        <span className="label-text font-semibold">
                          You are a
                        </span>
                      </label>
                      <select
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                        className="select select-bordered w-full rounded-lg"
                      >
                        <option value="" disabled>
                          Select one
                        </option>
                        <option value="donor">Blood Donor</option>
                        <option value="receiver">Blood Receiver</option>
                        <option value="volunteer">Volunteer</option>
                        <option value="organization">Organization</option>
                        <option value="visitor">General Visitor</option>
                      </select>
                    </div>

                    <div>
                      <label className="label">
                        <span className="label-text font-semibold">Rating</span>
                      </label>
                      <div className="flex gap-2 items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className={`text-2xl transition ${form.rating >= star ? "text-yellow-400" : "text-base-300"}`}
                            aria-label={`Rate ${star}`}
                          >
                            ★
                          </button>
                        ))}
                        <span className="text-sm text-base-content/60 ml-2">
                          {form.rating ? `${form.rating}/5` : "No rating"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text font-semibold">Message</span>
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Write your suggestions/experience..."
                      className="textarea textarea-bordered w-full rounded-lg min-h-[140px]"
                    />
                    <p className="mt-1 text-xs text-base-content/60">
                      Minimum 5 characters.
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <button
                      className="btn btn-neutral rounded-md px-8"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <span className="loading loading-spinner loading-sm"></span>
                          Submitting...
                        </>
                      ) : (
                        "Submit Feedback"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Recent */}
          <div className="lg:col-span-5">
            <div className="card bg-base-100 shadow-xl rounded-2xl border border-base-200">
              <div className="card-body">
                <h2 className="text-lg font-extrabold">Recent Feedback</h2>
                <p className="text-sm text-base-content/60">
                  Latest messages from users.
                </p>

                <div className="mt-4 space-y-3">
                  {recent.length === 0 ? (
                    <div className="text-sm text-base-content/60">
                      No feedback yet.
                    </div>
                  ) : (
                    recent.map((f, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-base-200 p-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="font-semibold">
                            {f.name?.trim() ? f.name : "Anonymous"}
                            <span className="text-xs text-base-content/50 ml-2">
                              {f.role ? `(${f.role})` : ""}
                            </span>
                          </div>
                          <div className="text-sm text-yellow-500">
                            {f.rating ? "★".repeat(f.rating) : ""}
                          </div>
                        </div>
                        <p className="mt-2 text-sm text-base-content/70">
                          {f.message}
                        </p>
                        <p className="mt-2 text-xs text-base-content/50">
                          {f.createdAt
                            ? new Date(f.createdAt).toLocaleString()
                            : ""}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 text-xs text-base-content/60">
              Tip: You can show these feedbacks on Home page too.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
