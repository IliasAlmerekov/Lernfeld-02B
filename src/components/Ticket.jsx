import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Ticket.css";

const Ticket = ({ openTickets, role, email, currentTab }) => {
  const navigate = useNavigate();

  const handleTicketClick = (ticketId) => {
    navigate(`/tickets/${ticketId}`, {
      state: {
        role,
        email,
        currentTab,
      },
    });
  };

  return (
    <>
      {openTickets &&
        openTickets.map((ticket) => (
          <div
            className="card"
            key={ticket._id}
            onClick={() => handleTicketClick(ticket._id)}
          >
            <div className="card-header">
              <span className={`priority ${ticket.priority.toLowerCase()}`}>
                {ticket.priority.charAt(0).toUpperCase() +
                  ticket.priority.slice(1)}
              </span>
              {ticket.status && (
                <span className={`status ${ticket.status}`}>
                  {ticket.status}
                </span>
              )}
            </div>
            <h2 className="card-title">{ticket.title}</h2>
            <p className="card-description">{ticket.description}</p>
            <div className="card-footer">
              <div className="card-owner">
                <p>Created by: {ticket.owner.email}</p>
              </div>
              <div className="view-details">
                <span>View Details &rarr;</span>
              </div>
            </div>
          </div>
        ))}
    </>
  );
};

export default Ticket;
