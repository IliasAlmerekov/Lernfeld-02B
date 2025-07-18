import React from "react";
import "../styles/Overlay.css";

const Overlay = ({ show, onClose, title, message, buttonText }) => {
  if (!show) return null;

  return (
    <div className="overlay-backdrop">
      <div className="overlay-container">
        <div className="overlay-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="#4ade80"
          >
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
        </div>

        <div className="overlay-demo-label">ScooTeq HELPDESK</div>

        <h2 className="overlay-title">{title}</h2>

        <p className="overlay-message">{message}</p>

        <button className="overlay-button" onClick={onClose}>
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default Overlay;
