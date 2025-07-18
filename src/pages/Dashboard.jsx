import React, { useState, useEffect } from "react";
import AdminDashboard from "./AdminDashboard";
import "../styles/Dashboard.css";
import "../App.css";
import { jwtDecode } from "jwt-decode";
import StatCard from "../components/StatCard";
import { useOutletContext } from "react-router-dom";

const Dashboard = () => {
  const { role, email } = useOutletContext() || {};
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserName(decoded.name || "");
      } catch (error) {
        console.error("Invalid token", error);
      }
    }
  }, []);

  if (role === "admin") {
    return <AdminDashboard role={role} email={email} userName={userName} />;
  }

  return (
    <>
      <div className="dashboard-header">
        <div className="header-content">
          <div>
            <h1>Dashboard</h1>
            <p>
              Hello <b>{userName}</b>, <br />
              Welcome back! Here's an overview of your support tickets.
            </p>
          </div>
        </div>
      </div>
      <StatCard role={role} />
    </>
  );
};

export default Dashboard;
