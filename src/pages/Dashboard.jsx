import React, { useState, useEffect } from "react";
import AdminDashboard from "./AdminDashboard";
import "../styles/Dashboard.css";
import "../App.css";
import { jwtDecode } from "jwt-decode";
import StatCard from "../components/StatCard";
import { useOutletContext } from "react-router-dom";
import Ticket from "../components/Ticket";
import { getUserTickets } from "../api/api";

const Dashboard = () => {
  const { role, email } = useOutletContext() || {};
  const [userName, setUserName] = useState("");
  const [lastTicket, setLastTicket] = useState();

  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserName(decoded.name || "");
        getLastTicket();
      } catch (error) {
        console.error("Invalid token", error);
      }
    }
  }, []);

  const getLastTicket = async () => {
    try {
      const tickets = await getUserTickets();
      if (tickets && tickets.length > 0) {
        const sortedTickets = tickets.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setLastTicket(sortedTickets[0]);
      }
    } catch (error) {
      console.error("Failed to fetch latest ticket:", error);
    }
  };

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
      <div className="last-ticket-container">
        <Ticket lastTicket={lastTicket} />
      </div>
    </>
  );
};

export default Dashboard;
