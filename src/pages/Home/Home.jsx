import React from "react";
import Banner from "../Banner/Banner";
import Mission from "../Mission/Mission";
import Collaborators from "../Collaborators/Collaborators";
import HowToGetBlood from "../HowToGetBlood/HowToGetBlood";

const Home = () => {
  return (
    <div>
      ami home page
      <Banner></Banner>
      <Mission></Mission>
      <Collaborators></Collaborators>
      <HowToGetBlood></HowToGetBlood>
    </div>
  );
};

export default Home;
