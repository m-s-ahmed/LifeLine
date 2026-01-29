import React from "react";
import { NavLink } from "react-router";

const Navbar = () => {
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
          <ul className="p-2 bg-base-100 w-60 z-1">
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
  return (
    <div>
      <div className=" navbar bg-base-100 shadow-sm">
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
                {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />{" "}
              </svg>
            </div>
            <ul
              tabIndex="-1"
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              {navLinks}
            </ul>
          </div>
          <a className="btn btn-ghost text-xl">LifeLine</a>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">{navLinks}</ul>
        </div>
        <div className="navbar-end mr-5">
          <a className="btn btn-outline px-10">Login</a>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
