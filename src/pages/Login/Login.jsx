import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";

export default function Login() {
  const { signIn, googleSignIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    try {
      setBusy(true);
      await signIn(email, password);
      navigate(from, { replace: true });
    } catch (e2) {
      setErr(e2?.message || "Login failed");
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    setErr("");
    try {
      setBusy(true);
      await googleSignIn();
      navigate(from, { replace: true });
    } catch (e2) {
      setErr(e2?.message || "Google login failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="min-h-[calc(100vh-72px)] bg-base-200/40">
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <div className="grid gap-6 lg:grid-cols-2 items-center">
          {/* Left: promo */}
          <div className="hidden lg:block">
            <div className="rounded-3xl border border-base-200 bg-base-100 p-8 shadow-sm">
              <h1 className="text-4xl font-extrabold leading-tight">
                Welcome back to <span className="text-primary">LifeLine</span>
              </h1>
              <p className="mt-3 text-base-content/70">
                Login to manage your donor profile, view requests, and help
                faster in emergencies.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-base-200/40 p-4">
                  <p className="text-sm font-semibold">Fast Access</p>
                  <p className="text-sm text-base-content/70 mt-1">
                    One-click profile & updates
                  </p>
                </div>
                <div className="rounded-2xl bg-base-200/40 p-4">
                  <p className="text-sm font-semibold">Secure</p>
                  <p className="text-sm text-base-content/70 mt-1">
                    Firebase authentication
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: form */}
          <div className="mx-auto w-full max-w-md">
            <div className="rounded-3xl border border-base-200 bg-base-100 shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-[#4b0c2a] via-[#7a0f3a] to-[#c21d4b] px-6 py-5">
                <h2 className="text-xl font-extrabold text-white">Login</h2>
                <p className="text-white/80 text-sm mt-1">
                  Use your email & password to continue
                </p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {err && (
                  <div className="alert alert-error">
                    <span className="text-sm">{err}</span>
                  </div>
                )}

                <div>
                  <label className="label">
                    <span className="label-text text-sm font-semibold">
                      Email
                    </span>
                  </label>
                  <input
                    className="input input-bordered w-full rounded-xl"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="label">
                    <span className="label-text text-sm font-semibold">
                      Password
                    </span>
                  </label>
                  <input
                    className="input input-bordered w-full rounded-xl"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>

                <button
                  className="btn btn-neutral w-full rounded-xl"
                  disabled={busy}
                >
                  {busy ? (
                    <>
                      <span className="loading loading-spinner loading-sm" />
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </button>

                <div className="divider text-sm">OR</div>

                <button
                  type="button"
                  onClick={handleGoogle}
                  className="btn btn-outline w-full rounded-xl"
                  disabled={busy}
                >
                  Continue with Google
                </button>

                <p className="text-sm text-center text-base-content/70">
                  Don’t have an account?{" "}
                  <Link
                    className="link link-hover font-semibold"
                    to="/regasdonor"
                  >
                    Register as Donor
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
