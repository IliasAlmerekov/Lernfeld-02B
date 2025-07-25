import React, { useEffect, useState } from "react";
import "../styles/AllTickets.css";
import { getAllTickets } from "../api/api";
import Ticket from "./Ticket";

const AllTickets = ({ role, email, currentTab }) => {
  const [allTickets, setAllTickets] = useState([]);

  const sortByNewest = (ticketsToSort) => {
    return [...ticketsToSort].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  };

  useEffect(() => {
    const fetchAllTickets = async () => {
      try {
        const tickets = await getAllTickets();
        const sortedTickets = sortByNewest(tickets);
        setAllTickets(sortedTickets);
        console.log("Fetched tickets:", sortedTickets);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };
    fetchAllTickets();
  }, []);
  return (
    <div className="all-tickets">
      <div className="all-tickets-header">
        <h1>All Tickets</h1>
        <p>Manage and track all support requests</p>
      </div>
      <div className="ticket-container">
        <div className="ticket-section">
          <div className="ticket-list">
            <Ticket
              role={role}
              email={email}
              currentTab={currentTab}
              allTickets={allTickets}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllTickets;
