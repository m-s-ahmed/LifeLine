import React from "react";
import Banner from "../Banner/Banner";
import Mission from "../Mission/Mission";
import Collaborators from "../Collaborators/Collaborators";
import HowToGetBlood from "../HowToGetBlood/HowToGetBlood";
import HomeFeedbackCarousel from "../Feedback/HomeFeedbackCarousel";
import EventsSection from "../Events/EventsSection";
import BloodDonationAwareness from "../Benefits/BloodDonationAwareness";
import BloodDonationBenefits from "../Benefits/BloodDonationBenefits";

const Home = () => {
  return (
    <div>
      <Banner></Banner>
      <EventsSection></EventsSection>
      {/* <Mission></Mission> */}
      <BloodDonationAwareness></BloodDonationAwareness>
      <BloodDonationBenefits></BloodDonationBenefits>
      <Collaborators></Collaborators>
      <HowToGetBlood></HowToGetBlood>
      <HomeFeedbackCarousel></HomeFeedbackCarousel>
    </div>
  );
};

export default Home;
