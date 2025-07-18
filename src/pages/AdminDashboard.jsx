import React from "react";
import StatCard from "../components/StatCard";
import { useOutletContext } from "react-router-dom";

const AdminDashboard = ({ role, email, userName }) => {
  const outletContext = useOutletContext() || {}; // Outlet context is used to get role and email if not provided as props

  // Use context values if not provided as props
  const userRole = role || outletContext.role;
  const userEmail = email || outletContext.email;

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
        <StatCard role={userRole} email={userEmail} userName={userName} />
      </div>
    </>
  );
};

export default AdminDashboard;
