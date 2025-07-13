import React from "react";
import logo from "../assets/scooteq.png";
import "./Sidebar.css";
import LogoutBtn from "./LogoutBtn";
import dashboard from "../assets/dashboards.png";
import ticket from "../assets/ticket.png";
import plus from "../assets/plus.png";

const Sidebar = ({ role, email }) => {
  const userMenuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      path: "/dashboard",
      icon: dashboard,
    },
    { id: "tickets", label: "My Tickets", path: "/tickets", icon: ticket },
    {
      id: "create-ticket",
      label: "Create Ticket",
      path: "/create-ticket",
      icon: plus,
    },
  ];

  const adminMenuItems = [
    {
      id: "admin-dashboard",
      label: "Admin Dashboard",
      path: "admin-dashboard",
      icon: dashboard,
    },
    { id: "all-tickets", label: "All Tickets", path: "all-tickets" },
    { id: "analytics", label: "Analytics", path: "analytics" },
  ];

  const menuItems = role === "admin" ? adminMenuItems : userMenuItems;

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <img src={logo} className="nav-logo" alt="Logo" />
          <span className="logo-text">Helpdesk ScooTeq</span>
        </div>
      </div>
      <nav className="sidebar-menu">
        <ul className="nav-list">
          {menuItems.map((item) => (
            <li key={item.id} className="nav-item">
              <a href={item.path}>
                {item.icon && (
                  <img src={item.icon} alt="" className="nav-icon" />
                )}
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-info">
            <div className="user-name">{email}</div>
          </div>
        </div>
        <LogoutBtn />
      </div>
    </div>
  );
};

export default Sidebar;
