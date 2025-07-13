import React, { useState, useEffect } from "react";
import AdminDashboard from "./AdminDashboard";
import Sidebar from "./Sidebar";
import "./Dashboard.css";
import "../App.css";
import { jwtDecode } from "jwt-decode";
const Dashboard = () => {
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRole(decoded.role);
        setUser(decoded.email);
      } catch (error) {
        console.error("Invalid token", error);
        setRole(null);
      }
    }
  }, []);

  return (
    <>
      {role === "admin" ? (
        <AdminDashboard />
      ) : (
        <div className="dashboard-container">
          <header className="dashboard-header">
            {<Sidebar role={role} email={user} />}
          </header>
          <main className="dashboard-content"></main>
        </div>
      )}
    </>
  );
};

export default Dashboard;
