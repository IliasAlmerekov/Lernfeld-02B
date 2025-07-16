import React, { useEffect, useState } from "react";
import "../styles/AllTickets.css";
import { getAllTickets } from "../api/api";

const AllTickets = () => {
  const [openTickets, setOpenTickets] = useState([]);
  
  const [closedTickets, setClosedTickets] = useState([]);
  const [inProgressTickets, setInProgressTickets] = useState([]);

  useEffect(() => {
    const fetchAllTickets = async () => {
      try {
        const tickets = await getAllTickets();
        console.log("Fetched tickets:", tickets);
        setOpenTickets(
          tickets.filter((ticket) => ticket.status === "open").length
        );
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
        <div className="ticket-card">
          <div className="ticket-stats">
            <h2>
              🟡 Open <span>{openTickets}</span>
            </h2>
            <hr/>
            <div className="card">
                <p>{}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllTickets;
