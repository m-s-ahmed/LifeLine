import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";
import { axiosSecure } from "../../api/axiosSecure";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function AdminLogin() {
  const { signIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/admin-dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    try {
      setBusy(true);

      // 1) login
      const result = await signIn(email, password);

      // 2) fresh token nao
      const token = await result.user.getIdToken(true);

      // 3) admin-check with fresh token
      const res = await axiosSecure.get(
        `/api/donors/admin-check?email=${email}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // 4) admin na hole logout kore dao
      if (!res.data?.isAdmin) {
        await logout();
        setErr("You are not authorized as an admin.");
        return;
      }

      // 5) admin hole dashboard e jao
      navigate(from, { replace: true });
    } catch (error) {
      setErr(
        error?.response?.data?.message ||
          error?.message ||
          "Admin login failed",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="min-h-[calc(100vh-72px)] bg-base-200/40 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-base-200 bg-base-100 shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 px-6 py-5">
          <h2 className="text-2xl font-extrabold text-white">Admin Login</h2>
          <p className="text-white/80 text-sm mt-1">
            Login to manage request approvals and warnings
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
                Admin Email
              </span>
            </label>
            <input
              className="input input-bordered w-full rounded-xl"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
            />
          </div>

          <div className="relative">
            <label className="label">
              <span className="label-text text-sm font-semibold">Password</span>
            </label>

            <input
              className="input input-bordered w-full rounded-xl pr-10"
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <span
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-[45px] cursor-pointer text-gray-500"
            >
              {showPass ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button className="btn btn-neutral w-full rounded-xl" disabled={busy}>
            {busy ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Checking...
              </>
            ) : (
              "Login as Admin"
            )}
          </button>
        </form>
      </div>
    </section>
  );
}

