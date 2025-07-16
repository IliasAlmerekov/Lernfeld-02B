import React, { useEffect, useState } from "react";
import "../styles/StatCard.css";
import { getUserTickets } from "../api/api";

const StatCard = () => {
  const [stats, setStats] = useState({
    totalTickets: 0,
    openTickets: 0,
    inProgressTickets: 0,
    resolvedTickets: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const tickets = await getUserTickets();
        console.log("Fetched tickets for stats:", tickets);
        const totalTickets = tickets.length;
        const openTickets = tickets.filter(
          (ticket) => ticket.status === "open"
        ).length;
        const inProgressTickets = tickets.filter(
          (ticket) => ticket.status === "in-progress"
        ).length;
        const resolvedTickets = tickets.filter(
          (ticket) => ticket.status === "resolved"
        ).length;
        setStats({
          totalTickets,
          openTickets,
          inProgressTickets,
          resolvedTickets,
        });
      } catch (Error) {
        console.error("Error fetching tickets for stats:", Error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon">🎫</div>
        <div className="stat-content">
          <div className="stat-number">{stats.totalTickets}</div>
          <div className="stat-label">Total Tickets</div>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon">🟡</div>
        <div className="stat-content">
          <div className="stat-number">{stats.openTickets}</div>
          <div className="stat-label">Open</div>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon">🔄</div>
        <div className="stat-content">
          <div className="stat-number">{stats.inProgressTickets}</div>
          <div className="stat-label">In Progress</div>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon">✅</div>
        <div className="stat-content">
          <div className="stat-number">{stats.resolvedTickets}</div>
          <div className="stat-label">Resolved</div>
        </div>
      </div>
    </div>
  );
};
export default StatCard;
