import React, { useState, useEffect } from "react";
import "../styles/TicketCard.css";
import { getUserTickets, getAllTickets } from "../api/api";

const TicketCard = ({ role }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const ticketsData =
          role === "admin" ? await getAllTickets() : await getUserTickets();

        setTickets(ticketsData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching tickets:", err);
        setError("Failed to load tickets");
        setLoading(false);
      }
    };

    fetchTickets();
  }, [role]);

  if (loading)
    return (
      <div className="tickets-page">
        <div className="loading">Loading tickets...</div>
      </div>
    );
  if (error)
    return (
      <div className="tickets-page">
        <div className="error">{error}</div>
      </div>
    );

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("de-DE", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "open":
        return "🟢";
      case "in-progress":
        return "🔄";
      case "resolved":
        return "✅";
      default:
        return "❓";
    }
  };

  return (
    <div className="tickets-page">
      <div className="page-header">
        <h1>My Tickets</h1>
        <p>Manage and track your support requests</p>
      </div>
      <div className="tickets-list">
        {tickets.length === 0 ? (
          <div className="no-tickets">No tickets found</div>
        ) : (
          tickets.map((ticket) => (
            <div
              key={ticket._id}
              className={`ticket-card priority-${ticket.priority}`}
            >
              <div className="ticket-header">
                <div className="ticket-id">#{ticket._id.substring(0, 8)}</div>
                <div className={`ticket-priority ${ticket.priority}`}>
                  {ticket.priority}
                </div>
              </div>

              <div className="ticket-content">
                <h3 className="ticket-title">{ticket.title}</h3>
                <p className="ticket-description">{ticket.description}</p>
              </div>

              <div className="ticket-meta">
                <div className="ticket-category">
                  <span className="category-icon">🏷️</span>
                  <span className="category-label">Support</span>
                </div>
                <div className="ticket-dates">
                  <div className="date-item">
                    <span className="date-label">Created:</span>
                    <span className="date-value">
                      {ticket.createdAt ? formatDate(ticket.createdAt) : "N/A"}
                    </span>
                  </div>
                  <div className="date-item">
                    <span className="date-label">Updated:</span>
                    <span className="date-value">
                      {ticket.updatedAt ? formatDate(ticket.updatedAt) : "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {role === "admin" && ticket.owner && (
                <div className="ticket-user-info">
                  <div className="user-info-header">
                    <span className="user-icon">👤</span>
                    <span className="user-label">Submitted by:</span>
                  </div>
                  <div className="user-details">
                    <div className="user-name">
                      {ticket.owner.name || "User"}
                    </div>
                    <div className="user-email">{ticket.owner.email}</div>
                  </div>
                </div>
              )}

              <div className="ticket-footer">
                <div className="ticket-status">
                  <span className="status-icon">
                    {getStatusIcon(ticket.status)}
                  </span>
                  <span className="status-label">{ticket.status}</span>
                </div>

                {role === "admin" && (
                  <div className="admin-actions">
                    <select
                      className="status-select"
                      defaultValue={ticket.status}
                    >
                      <option value="open">Open</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TicketCard;
