import React from "react";
import "./LogoutBtn.css";

const LogoutBtn = () => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");

    // Redirect to login page after logout
    window.location.href = "/login";
  };

  return (
    <div>
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </div>
  );
};

export default LogoutBtn;
