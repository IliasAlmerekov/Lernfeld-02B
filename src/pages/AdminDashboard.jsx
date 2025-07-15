import React from "react";
import Sidebar from "../components/Sidebar";
import "../styles/AdminDashboard.css";

const AdminDashboard = ({ role, email }) => {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        {<Sidebar role={role} email={email} />}
      </header>
      <main className="dashboard-content"></main>
    </div>
  );
};

export default AdminDashboard;
