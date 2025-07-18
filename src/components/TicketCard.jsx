import React, { useState, useEffect } from "react";
import "../styles/TicketCard.css";
import {
  getUserTickets,
  getAllTickets,
  addComment,
  getTicketById,
  updateTicket,
} from "../api/api";

const TicketCard = ({ role }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedTicket, setExpandedTicket] = useState(null);
  const [commentContent, setCommentContent] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    priority: "",
  });
  // Function to sort tickets by creation date (newest first)
  const sortByNewest = (ticketsToSort) => {
    return [...ticketsToSort].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
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
      const updatedTickets = tickets.map((ticket) =>
        ticket._id === ticketId ? ticketDetails : ticket
      );
      setTickets(sortByNewest(updatedTickets));
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

      // Update the ticket in the list and maintain sorting
      const updatedTickets = tickets.map((ticket) =>
        ticket._id === ticketId ? updatedTicket : ticket
      );
      setTickets(sortByNewest(updatedTickets));

      // Clear the comment input
      setCommentContent("");
    } catch (err) {
      console.error("Error adding comment:", err);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEditClick = (e, ticket) => {
    e.stopPropagation(); // Prevent expanding the ticket when clicking edit
    setEditingTicket(ticket._id);
    setEditForm({
      title: ticket.title,
      description: ticket.description,
      priority: ticket.priority,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSubmit = async (e, ticketId) => {
    e.preventDefault();
    try {
      setSubmitLoading(true);
      const updatedTicket = await updateTicket(ticketId, editForm);
      const updatedTickets = tickets.map((ticket) =>
        ticket._id === ticketId ? { ...ticket, ...updatedTicket } : ticket
      );
      setTickets(sortByNewest(updatedTickets));
      setEditingTicket(null);
    } catch (err) {
      console.error("Error updating ticket:", err);
      setError("Failed to update ticket");
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
          [...tickets].reverse().map((ticket) => (
            <div
              key={ticket._id}
              className={`ticket-card priority-${ticket.priority} ${
                expandedTicket === ticket._id ? "expanded" : ""
              }`}
            >
              <div className="ticket-header">
                <div className="ticket-id">#{ticket._id.substring(0, 8)}</div>
                <div className={`ticket-priority ${ticket.priority}`}>
                  {ticket.priority}
                </div>
                {(role === "admin" ||
                  ticket.owner?._id === localStorage.getItem("userId")) && (
                  <button
                    className="edit-button"
                    onClick={(e) => handleEditClick(e, ticket)}
                  >
                    ✏️ Edit
                  </button>
                )}
              </div>

              {editingTicket === ticket._id ? (
                <form
                  className="edit-form"
                  onSubmit={(e) => handleEditSubmit(e, ticket._id)}
                >
                  <div className="form-group">
                    <label>Title</label>
                    <input
                      type="text"
                      name="title"
                      value={editForm.title}
                      onChange={handleEditChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      name="description"
                      value={editForm.description}
                      onChange={handleEditChange}
                      required
                      rows="4"
                    />
                  </div>
                  <div className="form-group">
                    <label>Priority</label>
                    <select
                      name="priority"
                      value={editForm.priority}
                      onChange={handleEditChange}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div className="edit-actions">
                    <button
                      type="submit"
                      className="save-btn"
                      disabled={submitLoading}
                    >
                      {submitLoading ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={() => setEditingTicket(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
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
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TicketCard;
