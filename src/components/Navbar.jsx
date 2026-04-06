import React, { useContext, useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";
import NotificationsDropdown from "../components/NotificationDropdown";
import { axiosSecure } from "../api/axiosSecure";

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
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user?.email) {
        setIsAdmin(false);
        return;
      }

      try {
        const res = await axiosSecure.get(
          `/api/donors/admin-check?email=${user.email}`,
        );
        setIsAdmin(res.data?.isAdmin === true);
      } catch (error) {
        console.log(error);
        setIsAdmin(false);
      }
    };

    checkAdmin();
  }, [user]);

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
            <li>
              <NavLink
                to="/admin-login"
                className={({ isActive }) =>
                  isActive ? "text-primary font-bold" : ""
                }
              >
                Admin Login
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

        {/* <Link to="/" className="btn  btn-outline text-xl">
          LifeLine
        </Link> */}
        <Link to="/">
          <button class="relative inline-flex items-center justify-center px-8 py-2.5 overflow-hidden tracking-tighter text-white bg-red-900 rounded-md group">
            <span class="absolute w-0 h-0 transition-all duration-500 ease-out bg-green-600 rounded-full group-hover:w-56 group-hover:h-56"></span>
            <span class="absolute bottom-0 left-0 h-full -ml-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-auto h-full opacity-100 object-stretch"
                viewBox="0 0 487 487"
              >
                <path
                  fill-opacity=".1"
                  fill-rule="nonzero"
                  fill="#FFF"
                  d="M0 .3c67 2.1 134.1 4.3 186.3 37 52.2 32.7 89.6 95.8 112.8 150.6 23.2 54.8 32.3 101.4 61.2 149.9 28.9 48.4 77.7 98.8 126.4 149.2H0V.3z"
                ></path>
              </svg>
            </span>
            <span class="absolute top-0 right-0 w-12 h-full -mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="object-cover w-full h-full"
                viewBox="0 0 487 487"
              >
                <path
                  fill-opacity=".1"
                  fill-rule="nonzero"
                  fill="#FFF"
                  d="M487 486.7c-66.1-3.6-132.3-7.3-186.3-37s-95.9-85.3-126.2-137.2c-30.4-51.8-49.3-99.9-76.5-151.4C70.9 109.6 35.6 54.8.3 0H487v486.7z"
                ></path>
              </svg>
            </span>
            <span class="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-gray-200"></span>
            <span class=" relative text-base font-bold">LifeLine</span>
          </button>
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">{navLinks}</ul>
      </div>
      {/* className="navbar-end mr-5 gap-10" */}
      <div className="navbar-end mr-2 sm:mr-5 flex items-center gap-2 sm:gap-4 md:gap-6 lg:gap-10 flex-wrap justify-end">
        {isAdmin && (
          <Link
            to="/admin-dashboard"
            className="bg-slate-900 text-white border border-slate-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300"
          >
            Admin Panel
          </Link>
        )}
        {!user ? (
          <Link
            to="/login"
            className="bg-red-950 text-white border border-red-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group"
          >
            <span class="bg-red-400 shadow-red-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
            Login
          </Link>
        ) : (
          <>
            <NotificationsDropdown />

            <Link to="/my-profile" className="btn btn-ghost btn-circle">
              <div className="avatar placeholder">
                <div className="flex justify-center items-center w-10 rounded-full bg-neutral text-neutral-content">
                  <span className="text-xs font-bold">
                    {getInitials(user?.displayName || user?.email || "User")}
                  </span>
                </div>
              </div>
            </Link>

            <button
              onClick={handleLogout}
              className="bg-red-950 text-white border border-red-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group"
            >
              {/* className="btn btn-neutral px-8" */}
              <span class="bg-red-400 shadow-red-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
