import { useState } from "react";
import "./Welcome.css";

import {
  BsGenderFemale,
  BsGenderMale,
  BsFacebook,
  BsInstagram,
} from "react-icons/bs";

import { FaTwitterSquare } from "react-icons/fa";
import MainComponent from "../MainComponent";
const Welcome = () => {
  const [selectedGender, setSelectedGender] = useState(null);

  return !selectedGender ? (
    <div className="app">
      <h1>Choose your Gender</h1>
      <div className="gender-selection">
        <div
          className="gender-box female-box"
          onClick={() => {
            setSelectedGender("MEN");
          }}
        >
          <h2>Female</h2>
          <BsGenderFemale className="icon" />
          {/* Insérez tout contenu ou fonctionnalité spécifique aux femmes ici */}
        </div>

        <div
          className="gender-box male-box"
          onClick={() => {
            setSelectedGender("WOMEN");
          }}
        >
          <h2>Male</h2>
          <BsGenderMale className="icon" />
          {/* Insérez tout contenu ou fonctionnalité spécifique aux hommes ici */}
        </div>
      </div>

      <div className="app-description">
        <p>
          Welcome to our Tinder app! It's as easy as swiping right to like
          someone, left to pass, and up to super like. Every day, we announce
          the top-ranked person on our social media platforms. If you need
          further assistance or want to update your profile picture, feel free
          to reach out to our support team via email with your full name.
        </p>

        <div className="socials">
          <a
            href="https://www.facebook.com/profile.php?id=61550960464415"
            target="_blank"
            rel="noopener noreferrer"
          >
            <BsFacebook className="social-icon" />
          </a>
          <a
            href="https://twitter.com/IsimmTinder?s=20"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTwitterSquare className="social-icon" />
          </a>
          <a
            href="https://www.instagram.com/tinder_isimm/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <BsInstagram className="social-icon" />
          </a>
        </div>
        <div className="support">Support : isimmtinder@gmail.com</div>
      </div>
    </div>
  ) : (
    <MainComponent gender={selectedGender} />
  );
};

export default Welcome;
