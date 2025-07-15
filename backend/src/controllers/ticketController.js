// Controller zum Abrufen aller Tickets (für Admin)
// Gibt alle Tickets mit User-Info (owner) zurück
export const getAllTickets = async (req, res) => {
  try {
    // Finde alle Tickets und fülle das owner-Feld mit User-Daten
    const tickets = await Ticket.find().populate("owner", "email role");
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({
      message: "Tickets konnten nicht geladen werden",
      error: error.message,
    });
  }
};

// Controller zum Abrufen aller Tickets des angemeldeten Benutzers
export const getUserTickets = async (req, res) => {
  try {
    // Finde alle Tickets des angemeldeten Benutzers
    const tickets = await Ticket.find({ owner: req.user._id }).populate(
      "owner",
      "email name role"
    ); // Füge Benutzerinformationen hinzu
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({
      message: "Benutzer-Tickets konnten nicht geladen werden",
      error: error.message,
    });
  }
};

// Importiere das Ticket-Modell
import Ticket from "../models/ticketModel.js";

// Controller zum Erstellen eines neuen Tickets
// Diese Funktion wird aufgerufen, wenn ein User ein Ticket erstellt
// Der User muss authentifiziert sein (authMiddleware)
export const createTicket = async (req, res) => {
  try {
    // Hole die Felder aus dem Request-Body
    const { title, description, priority } = req.body;

    // Erstelle ein neues Ticket in der Datenbank
    // owner wird aus req.user._id gesetzt
    const ticket = await Ticket.create({
      title,
      description,
      priority,
      owner: req.user._id, // User-Referenz
      status: "open",
    });

    // Sende das erstellte Ticket als Antwort zurück
    res.status(201).json(ticket);
  } catch (error) {
    // Fehlerbehandlung: Sende eine Fehlermeldung zurück
    res.status(400).json({
      message: "Ticket konnte nicht erstellt werden",
      error: error.message,
    });
  }
};
