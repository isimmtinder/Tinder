import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import "./NotAllowed.css"; // Import a CSS file for styling (create one if it doesn't exist)

const NotAllowed = () => {
  return (
    <div className="not-allowed-container">
      <FaExclamationTriangle className="danger-icon" />
      <h1 className="error-title">Swipe Limit Reached</h1>
      <p className="error-message">
        You've reached your daily swipe limit. Don't worry, you can start swiping
        again in 6 hours!
      </p>
    </div>
  );
};

export default NotAllowed;