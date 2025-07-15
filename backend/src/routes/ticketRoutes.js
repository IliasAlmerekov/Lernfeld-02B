import express from "express";
import {
  createTicket,
  getAllTickets,
  getUserTickets,
} from "../controllers/ticketController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Route zum Abrufen aller Tickets (Admin)
// GET /api/tickets
router.get("/", authMiddleware, getAllTickets);

// Route zum Abrufen der Tickets des angemeldeten Benutzers
// GET /api/tickets/user
router.get("/user", authMiddleware, getUserTickets);

// Route zum Erstellen eines neuen Tickets
// Nur für authentifizierte Benutzer
// POST /api/tickets
router.post("/", authMiddleware, createTicket);

export default router;
