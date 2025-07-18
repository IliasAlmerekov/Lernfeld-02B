import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/TicketCard.css";
import ticketIcon from "../assets/ticket-icon.png";
import TicketStatusLabel from "./TicketStatusLabel";
import { getUserTickets, getAllTickets } from "../api/api";

const TicketCard = ({ role }) => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to sort tickets by creation date (newest first)
  const sortByNewest = (ticketsToSort) => {
    return [...ticketsToSort].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  };

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const ticketsData =
          role === "admin" ? await getAllTickets() : await getUserTickets();

        // Sort tickets by creation date, newest first
        const sortedTickets = sortByNewest(ticketsData);
        setTickets(sortedTickets);
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
              onClick={() =>
                navigate(`/tickets/${ticket._id}`, { state: { role } })
              }
            >
              <div className="ticket-header">
                <TicketStatusLabel status={ticket.status} />
                <div className={`ticket-priority ${ticket.priority}`}>
                  {ticket.priority}
                </div>
              </div>
              <>
                <div className="ticket-content-card">
                  <img src={ticketIcon} alt="Ticket Icon" />
                  <h3 className="ticket-title">{ticket.title}</h3>
                </div>

                <div className="ticket-meta">
                  {ticket.owner && (
                    <div className="ticket-user-info">
                      User:{" "}
                      <span className="user-name">
                        <b> {ticket.owner.name || "User"}</b>
                      </span>
                    </div>
                  )}
                  <div className="ticket-dates">
                    Submitted{" "}
                    <span>
                      <b>
                        {ticket.createdAt
                          ? formatDate(ticket.createdAt)
                          : "N/A"}
                      </b>
                    </span>
                  </div>
                </div>

                <div className="ticket-footer">
                  <div className="ticket-id">
                    <b> Ticket ID: {ticket._id.substring(0, 4)}</b>
                  </div>
                  <div className="ticket-comments-info">
                    <span className="comment-count">
                      <b> {ticket.comments?.length || 0} comments</b>
                    </span>
                  </div>
                </div>
              </>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TicketCard;
