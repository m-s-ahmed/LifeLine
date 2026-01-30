import React from "react";
import blood1 from "../../assets/blood1.jpg";
import { Link } from "react-router";

const Banner = () => {
  return (
    <div>
      <div className=" hero bg-base-200">
        <div className="hero-content flex-col lg:flex-row">
          <img src={blood1} />
          <div>
            <h1 className="text-5xl font-bold">
              Donate Blood and Save a Life!
            </h1>
            <p className="py-6">
              Every drop of blood you donate can give someone a second chance at
              life. Join our mission to ensure safe and timely blood for those
              in need. Your small act today can become someone’s biggest hope
              tomorrow.
            </p>
            {/* <Link to="/feedback">
              <button className="btn btn-error ">Get Started</button>
            </Link> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
