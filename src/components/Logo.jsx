import React from "react";
import Image from "./../assets/images/misc/TinderIsimmLogo.png";
import { useNavigate } from "react-router-dom";
const Logo = () => {
  const navigate = useNavigate();
  return (
    <div>
      <img
        src={Image}
        alt="Tinder Isimm Logo"
        onClick={() => {
          navigate;
        }}
      />
    </div>
  );
};

export default Logo;
