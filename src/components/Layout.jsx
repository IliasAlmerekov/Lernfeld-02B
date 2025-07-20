import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { jwtDecode } from "jwt-decode";

const Layout = () => {
  const [role, setRole] = useState(null);
  const [email, setEmail] = useState(null);
  const [currentTab, setCurrentTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  // Determine current tab based on the current path
  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/dashboard")) {
      setCurrentTab(role === "admin" ? "admin-dashboard" : "dashboard");
    } else if (path.includes("/tickets") && !path.includes("/tickets/")) {
      setCurrentTab(role === "admin" ? "all-tickets" : "tickets");
    } else if (path.includes("/all-tickets")) {
      setCurrentTab("all-tickets");
    } else if (path.includes("/analytics")) {
      setCurrentTab("analytics");
    } else if (path.includes("/create-ticket")) {
      setCurrentTab("create-ticket");
    }
  }, [location.pathname, role]);

  // Get user info from token
  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRole(decoded.role);
        setEmail(decoded.email);
      } catch (error) {
        console.error("Invalid token", error);
        setRole(null);
        // Redirect to login if token is invalid
        navigate("/login");
      }
    } else {
      // Redirect to login if no token exists
      navigate("/login");
    }
  }, [navigate]);

  // Handle tab change from sidebar
  const handleTabChange = (tabId) => {
    setCurrentTab(tabId);

    // Navigate to the corresponding route based on the tab ID
    switch (tabId) {
      case "dashboard":
        navigate("/dashboard");
        break;
      case "admin-dashboard":
        navigate("/dashboard");
        break;
      case "tickets":
        navigate("/tickets");
        break;
      case "all-tickets":
        navigate("/all-tickets");
        break;
      case "analytics":
        navigate("/analytics");
        break;
      case "create-ticket":
        navigate("/create-ticket");
        break;
      default:
        break;
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <div className="dashboard-container">
      <Sidebar
        role={role}
        email={email}
        currentTab={currentTab}
        onTabChange={handleTabChange}
        onSearch={handleSearch}
      />
      <main className="dashboard-content">
        <Outlet context={{ role, email, currentTab, searchQuery }} />
      </main>
    </div>
  );
};

export default Layout;
