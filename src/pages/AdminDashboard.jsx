import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import AllTickets from "../components/AllTickets";
import Analytics from "../components/Analytics";
import "../styles/AdminDashboard.css";

const AdminDashboard = ({ role, email, userName }) => {
  const [currentTab, setCurrentTab] = useState("admin-dashboard");
  const renderContent = () => {
    switch (currentTab) {
      case "admin-dashboard":
        return (
          <>
            <div className="dashboard-header">
              <div className="header-content">
                <div>
                  <h1>Dashboard</h1>
                  <p>
                    Hello <b>{userName}</b>, <br />
                    Welcome to the admin dashboard! Here you can manage all
                  </p>
                </div>
              </div>
            </div>
          </>
        );
      case "all-tickets":
        return <AllTickets />;
      case "analytics":
        return <Analytics />;
      default:
        return null;
    }
  };
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        {<Sidebar role={role} email={email} onTabChange={setCurrentTab} />}
      </header>
      <main className="dashboard-content">{renderContent()}</main>
    </div>
  );
};

export default AdminDashboard;
