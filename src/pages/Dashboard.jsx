import React, { useState, useEffect } from "react";
import AdminDashboard from "./AdminDashboard";
import Sidebar from "../components/Sidebar";
import "../styles/Dashboard.css";
import "../App.css";
import { jwtDecode } from "jwt-decode";
import StatCard from "../components/StatCard";
import CreateTicket from "../components/CreateTicket";
import TicketCard from "../components/TicketCard";
const Dashboard = () => {
  const [role, setRole] = useState(null);
  const [email, setEmail] = useState(null);
  const [userName, setUserName] = useState("");
  const [currentTab, setCurrentTab] = useState("dashboard");

  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRole(decoded.role);
        setEmail(decoded.email);
        setUserName(decoded.name || "");
      } catch (error) {
        console.error("Invalid token", error);
        setRole(null);
      }
    }
  }, []);

  const renderContent = () => {
    switch (currentTab) {
      case "dashboard":
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
            <StatCard />
          </>
        );
      case "create-ticket":
        return <CreateTicket />;
      case "tickets":
        return <TicketCard role={role} />;
      default:
        return null;
    }
  };

  return (
    <>
      {role === "admin" ? (
        <AdminDashboard role={role} email={email} userName={userName} />
      ) : (
        <div className="dashboard-container">
          <Sidebar
            role={role}
            email={email}
            currentTab={currentTab}
            onTabChange={setCurrentTab}
          />
          <main className="dashboard-content">{renderContent()}</main>
        </div>
      )}
    </>
  );
};

export default Dashboard;
