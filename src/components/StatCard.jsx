import React from "react";
import "../styles/StatCard.css";

const StatCard = () => {
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon">🎫</div>
        <div className="stat-content">
          <div className="stat-number">1</div>
          <div className="stat-label">Total Tickets</div>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon">🟡</div>
        <div className="stat-content">
          <div className="stat-number">1</div>
          <div className="stat-label">Open</div>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon">🔄</div>
        <div className="stat-content">
          <div className="stat-number">1</div>
          <div className="stat-label">In Progress</div>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon">✅</div>
        <div className="stat-content">
          <div className="stat-number">1</div>
          <div className="stat-label">Resolved</div>
        </div>
      </div>
    </div>
  );
};
export default StatCard;
