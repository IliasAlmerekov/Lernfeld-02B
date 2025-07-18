import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Ticket.css";
import ticketIcon from "../assets/ticket-icon.png";
import TicketStatusLabel from "./TicketStatusLabel";

const Ticket = ({
  allTickets,
  openTickets,
  inProgressTickets,
  closedTickets,
  role,
  email,
  currentTab,
  lastTicket,
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
          <p>
            Created by: <b>{ticket.owner.name}</b>
          </p>
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
        <p>{allTickets.length - index}</p>
        <p>
          <b>{ticket.title}</b>
        </p>
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

  const renderLastTicket = (ticket) => (
    <div
      key={ticket._id}
      className={`ticket-card priority-${ticket.priority}`}
      onClick={() => navigate(`/tickets/${ticket._id}`, { state: { role } })}
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
              <b>{ticket.createdAt ? formatDate(ticket.createdAt) : "N/A"}</b>
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
  );

  return (
    <>
      {openTickets && [...openTickets].reverse().map(renderTicketCard)}
      {lastTicket && renderLastTicket(lastTicket)}

      {inProgressTickets &&
        [...inProgressTickets].reverse().map(renderTicketCard)}

      {closedTickets && [...closedTickets].reverse().map(renderTicketCard)}
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
            {allTickets && [...allTickets].reverse().map(renderAllTickets)}
          </div>
        </div>
      )}
    </>
  );
};

export default Ticket;
