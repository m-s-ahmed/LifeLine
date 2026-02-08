import React, { useContext } from "react";
import { NavLink, Link } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";
import NotificationsDropdown from "../components/NotificationDropdown";

const getInitials = (text = "") => {
  const s = text.trim();
  if (!s) return "U"; //unknown user
  const parts = s.split(" ").filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return s.slice(0, 2).toUpperCase();
};

const Navbar = () => {
  // Object Destructuring
  const { user, logout } = useContext(AuthContext);

  const navLinks = (
    <>
      <li>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "text-primary font-bold" : ""
          }
        >
          Home
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive ? "text-primary font-bold" : ""
          }
        >
          About Us
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/findblood"
          className={({ isActive }) =>
            isActive ? "text-primary font-bold" : ""
          }
        >
          Find Blood
        </NavLink>
      </li>
      <li>
        <details>
          <summary>Register Now</summary>
          <ul className="p-2 bg-base-100 w-60 z-10">
            <li>
              <NavLink
                to="/regasdonor"
                className={({ isActive }) =>
                  isActive ? "text-primary font-bold" : ""
                }
              >
                Register As Donor
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/regasorganization"
                className={({ isActive }) =>
                  isActive ? "text-primary font-bold" : ""
                }
              >
                Register As Organization
              </NavLink>
            </li>
          </ul>
        </details>
      </li>
    </>
  );

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
          >
            {navLinks}
          </ul>
        </div>

        <Link to="/" className="btn btn-ghost text-xl">
          LifeLine
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">{navLinks}</ul>
      </div>

      <div className="navbar-end mr-5 gap-10">
        {!user ? (
          <Link to="/login" className="btn btn-outline px-10">
            Login
          </Link>
        ) : (
          <>
            <NotificationsDropdown />

            <Link to="/my-profile" className="btn btn-ghost btn-circle">
              <div className="avatar placeholder">
                <div className="w-10 rounded-full bg-neutral text-neutral-content">
                  <span className="text-xs font-bold">
                    {getInitials(user?.displayName || user?.email || "User")}
                  </span>
                </div>
              </div>
            </Link>

            <button onClick={handleLogout} className="btn btn-neutral px-8">
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
