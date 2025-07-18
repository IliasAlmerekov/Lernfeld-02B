import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import {
  useParams,
  useNavigate,
  useLocation,
  useOutletContext,
} from "react-router-dom";
import {
  getTicketById,
  updateTicket,
  addComment,
  getAdminUsers,
} from "../api/api";
import "../styles/TicketDetailPage.css";

// Constants
const STATUS_OPTIONS = ["open", "in-progress", "resolved", "closed"];
const INITIAL_EDITED_TICKET = {
  title: "",
  description: "",
  priority: "",
};

const TicketDetailPage = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const outletContext = useOutletContext() || {};

  // State
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState("");
  const [currentUser, setCurrentUser] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);

  // UI state
  const [statusDropdown, setStatusDropdown] = useState(false);
  const [assignDropdownOpen, setAssignDropdownOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTicket, setEditedTicket] = useState(INITIAL_EDITED_TICKET);

  // Use either location state or outlet context
  const roleFromState = location.state?.role || outletContext.role;

  // Helper functions for user authentication
  const getUserFromToken = () => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        return {
          _id: decoded.id,
          email: decoded.email,
          role: decoded.role,
          name: decoded.name,
        };
      } catch (err) {
        console.error("Invalid token", err);
        return null;
      }
    }
    return null;
  };

  // Load user data from token
  useEffect(() => {
    const userData = getUserFromToken();
    setCurrentUser(userData);
  }, []);

  // Fetch ticket and admin users if needed
  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true);
        const data = await getTicketById(ticketId);

        setTicket(data);
        setEditedTicket({
          title: data.title,
          description: data.description,
          priority: data.priority,
        });

        // Only fetch admin users if the current user is an admin
        const isAdmin =
          currentUser?.role === "admin" || roleFromState === "admin";
        if (isAdmin) {
          try {
            const admins = await getAdminUsers();
            setAdminUsers(admins);
          } catch (err) {
            console.error("Failed to fetch admin users:", err);
          }
        }
      } catch (err) {
        setError("Failed to fetch ticket details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [ticketId, roleFromState, currentUser]);

  // Helper function to update ticket and refresh data
  const updateTicketAndRefresh = async (updateData, errorMessage) => {
    try {
      await updateTicket(ticketId, updateData);
      const updatedTicket = await getTicketById(ticketId);
      setTicket(updatedTicket);
      return true;
    } catch (err) {
      setError(errorMessage);
      console.error(err);
      return false;
    }
  };

  // Helper function to check if user is admin
  const isAdmin = () =>
    roleFromState === "admin" || currentUser?.role === "admin";

  // Helper function to check if user can edit ticket - used directly in JSX

  // Event handlers
  const handleStatusChange = async (newStatus) => {
    const success = await updateTicketAndRefresh(
      { status: newStatus },
      "Failed to update ticket status"
    );
    if (success) setStatusDropdown(false);
  };

  const handleAssignTicket = async (userId) => {
    if (!userId) {
      setError("No user selected for assignment");
      return;
    }

    const success = await updateTicketAndRefresh(
      { assignedTo: userId },
      "Failed to assign ticket"
    );
    if (success) setAssignDropdownOpen(false);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedTicket((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const success = await updateTicketAndRefresh(
      editedTicket,
      "Failed to update ticket"
    );
    if (success) setIsEditing(false);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      await addComment(ticketId, comment);
      setComment("");

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
        {!isEditing ? (
          <>
            <h1>Title: {ticket.title}</h1>
            <div className="ticket-meta">
              <span className={`priority ${ticket.priority.toLowerCase()}`}>
                {ticket.priority.charAt(0).toUpperCase() +
                  ticket.priority.slice(1)}
              </span>
              <div className="status-container">
                <span
                  className={`status ${ticket.status}`}
                  onClick={() => setStatusDropdown(!statusDropdown)}
                >
                  {ticket.status} ▼
                </span>
                {statusDropdown && isAdmin() && (
                  <div className="status-dropdown">
                    {STATUS_OPTIONS.map((status) => (
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
              {(isAdmin() || currentUser?._id === ticket.owner?._id) && (
                <button className="edit-button" onClick={handleEditToggle}>
                  Edit Ticket
                </button>
              )}
            </div>
          </>
        ) : (
          <form className="edit-ticket-form" onSubmit={handleEditSubmit}>
            <div className="edit-field">
              <label>Title:</label>
              <input
                type="text"
                name="title"
                value={editedTicket.title}
                onChange={handleEditChange}
                required
              />
            </div>
            <div className="edit-field">
              <label>Priority:</label>
              <select
                name="priority"
                value={editedTicket.priority}
                onChange={handleEditChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="edit-buttons">
              <button type="submit">Save</button>
              <button type="button" onClick={handleEditToggle}>
                Cancel
              </button>
            </div>
          </form>
        )}
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
            <div className="assigned-to">
              <p>
                <strong>Assigned to:</strong> {ticket.assignedTo.name}
              </p>
              {isAdmin() && (
                <div className="reassign-container">
                  <button
                    className="reassign-button"
                    onClick={() => setAssignDropdownOpen(!assignDropdownOpen)}
                  >
                    Reassign
                  </button>
                  {assignDropdownOpen && (
                    <div className="assign-dropdown">
                      <div
                        className="assign-option"
                        onClick={() => {
                          if (currentUser && currentUser._id) {
                            handleAssignTicket(currentUser._id);
                          }
                        }}
                      >
                        Assign to me
                      </div>
                      {adminUsers.map(
                        (admin) =>
                          currentUser &&
                          admin._id !== currentUser._id && (
                            <div
                              key={admin._id}
                              className="assign-option"
                              onClick={() => handleAssignTicket(admin._id)}
                            >
                              {admin.name}
                            </div>
                          )
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : isAdmin() ? (
            <div className="assign-container">
              <button
                className="assign-button"
                onClick={() => setAssignDropdownOpen(!assignDropdownOpen)}
              >
                Assign Ticket ▼
              </button>
              {assignDropdownOpen && (
                <div className="assign-dropdown">
                  <div
                    className="assign-option"
                    onClick={() => {
                      if (currentUser && currentUser._id) {
                        handleAssignTicket(currentUser._id);
                      } else {
                        setError("User information not available");
                      }
                    }}
                  >
                    Assign to me
                  </div>
                  {adminUsers.map(
                    (admin) =>
                      currentUser &&
                      admin._id !== currentUser._id && (
                        <div
                          key={admin._id}
                          className="assign-option"
                          onClick={() => handleAssignTicket(admin._id)}
                        >
                          {admin.name}
                        </div>
                      )
                  )}
                </div>
              )}
            </div>
          ) : (
            <p>
              <strong>Assigned to:</strong> Unassigned
            </p>
          )}
        </div>

        <div className="ticket-description-container">
          <h3>Description</h3>
          {isEditing ? (
            <div className="edit-field">
              <textarea
                name="description"
                value={editedTicket.description}
                onChange={handleEditChange}
                rows="4"
              />
            </div>
          ) : (
            <p>{ticket.description}</p>
          )}
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
