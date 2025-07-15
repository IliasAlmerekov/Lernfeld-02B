import React, { useState, useEffect } from "react";
import "../styles/TicketCard.css";
import {
  getUserTickets,
  getAllTickets,
  addComment,
  getTicketById,
} from "../api/api";

const TicketCard = ({ role }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedTicket, setExpandedTicket] = useState(null);
  const [commentContent, setCommentContent] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

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

  const handleExpandTicket = async (ticketId) => {
    try {
      if (expandedTicket === ticketId) {
        // Collapse if clicking the same ticket
        setExpandedTicket(null);
        return;
      }

      setExpandedTicket(ticketId);

      // Fetch ticket details including comments
      const ticketDetails = await getTicketById(ticketId);

      // Update the ticket in the list with complete details including comments
      setTickets(
        tickets.map((ticket) =>
          ticket._id === ticketId ? ticketDetails : ticket
        )
      );
    } catch (err) {
      console.error("Error fetching ticket details:", err);
    }
  };

  const handleCommentSubmit = async (ticketId) => {
    if (!commentContent.trim()) return;

    try {
      setSubmitLoading(true);

      // Add comment to the ticket
      const updatedTicket = await addComment(ticketId, commentContent);

      // Update the ticket in the list with the new comment
      setTickets(
        tickets.map((ticket) =>
          ticket._id === ticketId ? updatedTicket : ticket
        )
      );

      // Clear the comment input
      setCommentContent("");
    } catch (err) {
      console.error("Error adding comment:", err);
    } finally {
      setSubmitLoading(false);
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
              className={`ticket-card priority-${ticket.priority} ${
                expandedTicket === ticket._id ? "expanded" : ""
              }`}
            >
              <div
                className="ticket-header"
                onClick={() => handleExpandTicket(ticket._id)}
              >
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

                <button
                  className="comments-toggle"
                  onClick={() => handleExpandTicket(ticket._id)}
                >
                  {expandedTicket === ticket._id
                    ? "Hide Comments"
                    : "Show Comments"}
                  <span className="comment-count">
                    {ticket.comments?.length || 0}
                  </span>
                </button>
              </div>

              {expandedTicket === ticket._id && (
                <div className="ticket-comments-section">
                  <h4 className="comments-heading">Comments</h4>

                  <div className="comments-list">
                    {ticket.comments && ticket.comments.length > 0 ? (
                      ticket.comments.map((comment, index) => (
                        <div key={index} className="comment-item">
                          <div className="comment-header">
                            <span className="comment-author">
                              {comment.author?.name || "User"}
                            </span>
                            <span className="comment-date">
                              {formatDate(comment.createdAt)}
                            </span>
                          </div>
                          <div className="comment-content">
                            {comment.content}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="no-comments">No comments yet</p>
                    )}
                  </div>

                  <div className="add-comment-form">
                    <textarea
                      className="comment-input"
                      placeholder="Add a comment..."
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                    ></textarea>
                    <button
                      className="submit-comment-btn"
                      onClick={() => handleCommentSubmit(ticket._id)}
                      disabled={submitLoading || !commentContent.trim()}
                    >
                      {submitLoading ? "Sending..." : "Add Comment"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TicketCard;
