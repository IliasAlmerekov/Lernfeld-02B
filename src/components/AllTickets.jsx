import React, { useEffect, useState } from "react";
import "../styles/AllTickets.css";
import { getAllTickets } from "../api/api";
import Ticket from "./Ticket";

const AllTickets = ({ role, email, currentTab }) => {
  const [stats, setStats] = useState({
    openTickets: 0,
    closedTickets: 0,
  });
  const [openTickets, setOpenTickets] = useState([]);
  const [closedTickets, setClosedTickets] = useState([]);
  const [inProgressTickets, setInProgressTickets] = useState([]);

  useEffect(() => {
    const fetchAllTickets = async () => {
      try {
        const tickets = await getAllTickets();
        console.log("Fetched tickets:", tickets);

        // Set full ticket objects to display them
        const openTicketsData = tickets.filter(
          (ticket) => ticket.status === "open"
        );
        const inProgressTicketsData = tickets.filter(
          (ticket) => ticket.status === "in-progress"
        );
        const closedTicketsData = tickets.filter(
          (ticket) => ticket.status === "closed" || ticket.status === "resolved"
        );

        setOpenTickets(openTicketsData);
        setInProgressTickets(inProgressTicketsData);
        setClosedTickets(closedTicketsData);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };
    fetchAllTickets();
  }, []);
  return (
    <div className="tickets-page">
      <div className="page-header">
        <h1>All Tickets</h1>
        <p>Manage and track all support requests</p>
      </div>
      <div className="ticket-container">
        <div className="ticket-section">
          <h2>
            🟡 Open Tickets <span>{openTickets.length}</span>
          </h2>
          <hr />
          <div className="ticket-list">
            <Ticket
              openTickets={openTickets}
              role={role}
              email={email}
              currentTab={currentTab}
            />
          </div>
        </div>

        <div className="ticket-section">
          <h2>
            🔵 In Progress <span>{inProgressTickets.length}</span>
          </h2>
          <hr />
          <div className="ticket-list">
            <Ticket
              openTickets={inProgressTickets}
              role={role}
              email={email}
              currentTab={currentTab}
            />
          </div>
        </div>

        <div className="ticket-section">
          <h2>
            🟢 Closed <span>{closedTickets.length}</span>
          </h2>
          <hr />
          <div className="ticket-list">
            <Ticket
              openTickets={closedTickets}
              role={role}
              email={email}
              currentTab={currentTab}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllTickets;
