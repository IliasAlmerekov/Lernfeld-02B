import React, { useState } from "react"; // useState importieren für die Zustandsverwaltung
import "../styles/CreateTicket.css";

const CreateTicket = () => {
  // Zustand für Ticketdaten initialisieren
  const [ticketData, setTicketData] = useState({
    title: "",
    priority: "medium",
    description: "",
  });

  // Zustand für Ladevorgang und Fehler
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Handler für Änderungen in Formularfeldern
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTicketData({
      ...ticketData,
      [name]: value,
    });
  };

  // Funktion zum Absenden des Formulars
  const handleSubmit = async (e) => {
    e.preventDefault(); // Standard-Formularverhalten verhindern

    setIsLoading(true);
    setError(null);

    try {
      // Token aus dem lokalen Speicher abrufen
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      console.log("Token:", token);

      if (!token) {
        throw new Error("You are not logged in. Please log in.");
      }

      // API-Anfrage zum Erstellen eines Tickets
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/tickets`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(ticketData),
        }
      );

      // Fehler überprüfen
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create ticket");
      }

      // Erfolg setzen und Formular zurücksetzen
      setSuccess(true);
      setTicketData({
        title: "",
        priority: "medium",
        description: "",
      });

      // Erfolgsmeldung nach 3 Sekunden zurücksetzen
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-ticket-page">
      <div className="page-header">
        <h1>Create New Ticket</h1>
        <p>Describe your issue and we'll help resolve it</p>
      </div>

      {/* Erfolgsmeldung anzeigen */}
      {success && (
        <div className="success-message">
          Ticket created successfully! We will get back to you soon.
        </div>
      )}

      {/* Fehlermeldung anzeigen */}
      {error && <div className="error-message">{error}</div>}

      <div className="create-ticket-form">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={ticketData.title}
              onChange={handleChange}
              placeholder="Brief description of the issue"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              name="priority"
              value={ticketData.priority}
              onChange={handleChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={ticketData.description}
              onChange={handleChange}
              placeholder="Please provide detailed information about your issue..."
              rows="6"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="file">Attach a file</label>
            <input type="file" id="file" name="file" />
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? "Will create..." : "Create Ticket"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTicket;
