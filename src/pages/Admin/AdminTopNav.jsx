import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users } from "lucide-react";

export default function AdminTopNav() {
  const linkClass = ({ isActive }) =>
    `inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${
      isActive
        ? "bg-slate-900 text-white shadow-lg"
        : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
    }`;

  return (
    <div className="mb-6 flex flex-wrap gap-3">
      <NavLink to="/admin-dashboard" className={linkClass}>
        <LayoutDashboard size={18} />
        Dashboard
      </NavLink>

      <NavLink to="/admin-donors" className={linkClass}>
        <Users size={18} />
        Donor Explorer
      </NavLink>

      <NavLink to="/admin-analytics" className={linkClass}>
        Analytics
      </NavLink>
    </div>
  );
}
