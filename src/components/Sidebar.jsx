import React from "react";
import logo from "../assets/scooteq.png";
import "../styles/Sidebar.css";
import LogoutBtn from "./LogoutBtn";
import dashboard from "../assets/dashboards.png";
import ticket from "../assets/ticket.png";
import plus from "../assets/plus.png";
import analytics from "../assets/analytics.png";
import konto from "../assets/konto.png";

const Sidebar = ({ role, email, currentTab, onTabChange }) => {
  const userMenuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: dashboard,
    },
    { id: "tickets", label: "My Tickets", path: "/tickets", icon: ticket },
    {
      id: "create-ticket",
      label: "Create Ticket",
      icon: plus,
    },
  ];

  const adminMenuItems = [
    {
      id: "admin-dashboard",
      label: "Admin Dashboard",
      icon: dashboard,
    },
    {
      id: "all-tickets",
      label: "All Tickets",
      icon: ticket,
    },
    { id: "analytics", label: "Analytics", icon: analytics },
  ];

  const menuItems = role === "admin" ? adminMenuItems : userMenuItems;

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <img src={logo} className="nav-logo" alt="Logo" />
          <span className="logo-text"> ScooTeq Hamburg GmbH</span>
        </div>
      </div>
      <nav className="sidebar-menu">
        <ul className="nav-list">
          {menuItems.map((item) => (
            <li
              key={item.id}
              className={`nav-item${currentTab === item.id ? " active" : ""}`}
              onClick={() => onTabChange(item.id)}
              style={{ cursor: "pointer" }}
            >
              <div className="nav-link">
                {item.icon && (
                  <img src={item.icon} alt="" className="nav-icon" />
                )}
                {item.id === "create-ticket" ? <b>{item.label}</b> : item.label}
              </div>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-info">
            <div className="user-name">
              <img src={konto} alt="User Icon" className="user-avatar" />
              {email}
            </div>
          </div>
        </div>
        <LogoutBtn />
      </div>
    </div>
  );
};

export default Sidebar;
