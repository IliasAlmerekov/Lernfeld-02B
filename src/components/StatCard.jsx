import React, { useEffect, useMemo, useState } from "react";
import "../styles/StatCard.css";
import Ticket from "./Ticket";
import { getUserTickets, getAllTickets } from "../api/api";

const STAT_CONFIG = [
  { key: "totalTickets", label: "Total Tickets", icon: "🎫" },
  { key: "openTickets", label: "Open", icon: "🟡" },
  { key: "inProgressTickets", label: "In Progress", icon: "🔄" },
  { key: "resolvedTickets", label: "Resolved", icon: "✅" },
];

const StatCard = ({ role, email, onTabChange, currentTab }) => {
  const [tickets, setTickets] = useState([]);
  const [openTickets, setOpenTickets] = useState([]);
  const [inProgressTickets, setInProgressTickets] = useState([]);
  const [resolvedTickets, setResolvedTickets] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        if (role !== "admin") {
          const data = await getUserTickets();
          setTickets(data);
        } else {
          const data = await getAllTickets();
          setTickets(data);
          setOpenTickets(data.filter((ticket) => ticket.status === "open"));
          setInProgressTickets(
            data.filter((ticket) => ticket.status === "in-progress")
          );
          setResolvedTickets(
            data.filter((ticket) => ticket.status === "resolved")
          );
        }
      } catch (Error) {
        console.error("Error fetching tickets for stats:", Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [role]);

  const stats = useMemo(() => {
    const statusCount = {
      openTickets: 0,
      inProgressTickets: 0,
      resolvedTickets: 0,
    };

    for (const ticket of tickets) {
      if (ticket.status === "open") statusCount.openTickets++;
      if (ticket.status === "in-progress") statusCount.inProgressTickets++;
      if (ticket.status === "resolved") statusCount.resolvedTickets++;
    }

    return {
      ...statusCount,
      totalTickets: tickets.length,
    };
  }, [tickets]);

  return (
    <>
      {isLoading ? (
        <div className="loading-stats">Loading statistics...</div>
      ) : role !== "admin" ? (
        <div className="stats-grid">
          {STAT_CONFIG.map(({ key, label, icon }) => (
            <div className="stat-card" key={key}>
              <div className="stat-icon">{icon}</div>
              <div className="stat-content">
                <div className="stat-number">{stats[key]}</div>
                <div className="stat-label">{label}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="admin-stats-grid">
          <div className="ticket-card-grid">
            <h3>
              <span>🟡</span> Open ({openTickets.length})
            </h3>
            <span className="break-open"></span>
            <Ticket
              openTickets={openTickets}
              inProgressTickets={inProgressTickets}
              resolvedTickets={resolvedTickets}
              role={role}
              email={email}
              onTabChange={onTabChange}
              currentTab={currentTab}
            />
          </div>
          <div className="ticket-card-grid">
            <h3>
              <span>✅</span> Closed ({resolvedTickets.length})
            </h3>
            <span className="break-closed"></span>
            <Ticket openTickets={resolvedTickets} role={role} />
          </div>
        </div>
      )}
    </>
  );
};
export default StatCard;
