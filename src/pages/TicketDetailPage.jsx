import React, { useState, useEffect } from "react";
import {
  useParams,
  useNavigate,
  useLocation,
  useOutletContext,
} from "react-router-dom";
import { getTicketById, updateTicket, addComment } from "../api/api";
import "../styles/TicketDetailPage.css";

const TicketDetailPage = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const outletContext = useOutletContext() || {};
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [statusDropdown, setStatusDropdown] = useState(false);

  // Use either location state or outlet context
  const roleFromState = location.state?.role || outletContext.role;
  const emailFromState = location.state?.email || outletContext.email;

  // Status options
  const statusOptions = ["open", "in-progress", "resolved", "closed"];

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true);
        const data = await getTicketById(ticketId);
        setTicket(data);

        // Get current user info from localStorage
        const userData = JSON.parse(
          localStorage.getItem("user") || sessionStorage.getItem("user")
        );
        setCurrentUser(userData);
      } catch (err) {
        setError("Failed to fetch ticket details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [ticketId]);
  console.log("Ticket Detail Page", ticket, roleFromState, emailFromState);
  const handleStatusChange = async (newStatus) => {
    try {
      await updateTicket(ticketId, { status: newStatus });
      setTicket({ ...ticket, status: newStatus });
      setStatusDropdown(false);
    } catch (err) {
      setError("Failed to update ticket status");
      console.error(err);
    }
  };

  const handleAssignTicket = async () => {
    try {
      // For now, assign to current user
      // In a real app, you might want a dropdown of available users
      await updateTicket(ticketId, { assignedTo: currentUser._id });

      // Refetch the ticket to update the UI
      const updatedTicket = await getTicketById(ticketId);
      setTicket(updatedTicket);
    } catch (err) {
      setError("Failed to assign ticket");
      console.error(err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      await addComment(ticketId, comment);
      setComment("");

      // Refetch the ticket to update the comments
      const updatedTicket = await getTicketById(ticketId);
      setTicket(updatedTicket);
    } catch (err) {
      setError("Failed to add comment");
      console.error(err);
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!ticket) return <div className="error">Ticket not found</div>;

  return (
    <div className="ticket-detail-container">
      <button className="back-button" onClick={goBack}>
        &larr; Back
      </button>
      <div className="ticket-header">
        <h1>{ticket.title}</h1>
        <div className="ticket-meta">
          <span className={`priority ${ticket.priority.toLowerCase()}`}>
            {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
          </span>
          <div className="status-container">
            <span
              className={`status ${ticket.status}`}
              onClick={() => setStatusDropdown(!statusDropdown)}
            >
              {ticket.status} ▼
            </span>
            {statusDropdown &&
              (roleFromState === "admin" || currentUser?.role === "admin") && (
                <div className="status-dropdown">
                  {statusOptions.map((status) => (
                    <div
                      key={status}
                      className={`status-option ${status}`}
                      onClick={() => handleStatusChange(status)}
                    >
                      {status}
                    </div>
                  ))}
                </div>
              )}
          </div>
        </div>
      </div>

      <div className="ticket-content">
        <div className="ticket-info">
          <p>
            <strong>Created by:</strong> {ticket.owner?.email || "Unknown"}
          </p>
          <p>
            <strong>Created at:</strong>{" "}
            {new Date(ticket.createdAt).toLocaleString()}
          </p>
          {ticket.assignedTo ? (
            <p>
              <strong>Assigned to:</strong> {ticket.assignedTo.email}
            </p>
          ) : roleFromState === "admin" || currentUser?.role === "admin" ? (
            <button className="assign-button" onClick={handleAssignTicket}>
              Assign to me
            </button>
          ) : (
            <p>
              <strong>Assigned to:</strong> Unassigned
            </p>
          )}
        </div>

        <div className="ticket-description">
          <h3>Description</h3>
          <p>{ticket.description}</p>
        </div>

        <div className="ticket-comments">
          <h3>Comments</h3>
          <div className="comments-list">
            {ticket.comments && ticket.comments.length > 0 ? (
              ticket.comments.map((comment, index) => (
                <div key={index} className="comment">
                  <div className="comment-header">
                    <span className="comment-author">
                      {comment.author?.email || "Unknown"}
                    </span>
                    <span className="comment-date">
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="comment-content">{comment.content}</p>
                </div>
              ))
            ) : (
              <p className="no-comments">No comments yet</p>
            )}
          </div>

          <form className="comment-form" onSubmit={handleAddComment}>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
              rows="3"
              required
            />
            <button type="submit">Add Comment</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailPage;
