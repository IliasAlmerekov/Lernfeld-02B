import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Ticket.css";

const Ticket = ({
  allTickets,
  openTickets,
  inProgressTickets,
  closedTickets,
  role,
  email,
  currentTab,
}) => {
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

  const renderTicketCard = (ticket) => (
    <div
      className="card"
      key={ticket._id}
      onClick={() => handleTicketClick(ticket._id)}
    >
      <div className="card-header">
        <span className={`priority ${ticket.priority.toLowerCase()}`}>
          {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
        </span>
        {ticket.status && (
          <span className={`status ${ticket.status}`}>{ticket.status}</span>
        )}
      </div>
      <h2 className="card-title">{ticket.title}</h2>
      <p className="card-description">{ticket.description}</p>
      <div className="card-footer">
        <div className="card-owner">
          <p>Created by: {ticket.owner.name}</p>
        </div>
        <div className="view-details">
          <span>View Details &rarr;</span>
        </div>
      </div>
    </div>
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const renderAllTickets = (ticket, index) => (
    <div className="ticket-list-container" key={ticket._id}>
      <div className="ticket-list-item">
        <p>{index + 1}</p>
        <p>{ticket.title}</p>
        <p>{ticket.createdAt ? formatDate(ticket.createdAt) : "N/A"}</p>
        <p className={`status ${ticket.status}`}>{ticket.status}</p>
        <div
          className="view-details"
          onClick={() => handleTicketClick(ticket._id)}
        >
          <span>View Details &rarr;</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {openTickets && openTickets.map(renderTicketCard)}

      {inProgressTickets && inProgressTickets.map(renderTicketCard)}

      {closedTickets && closedTickets.map(renderTicketCard)}
      {allTickets && (
        <div className="ticket-list-header">
          <div className="ticket-list-headline">
            <h2>Code</h2>
            <h2>Title</h2>
            <h2>Start Date</h2>
            <h2>Status</h2>
            <h2>Action</h2>
          </div>
          <div className="ticket-list-body">
            {allTickets && allTickets.map(renderAllTickets)}
          </div>
        </div>
      )}
    </>
  );
};

export default Ticket;
