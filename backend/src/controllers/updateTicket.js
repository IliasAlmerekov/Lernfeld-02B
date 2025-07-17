// Controller zum Aktualisieren eines Tickets
import { Ticket } from "../models/ticketModel.js";
export const updateTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { status, assignedTo } = req.body;

    // Finde das Ticket
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Nur Admins dürfen Tickets aktualisieren
    if (
      req.user.role !== "admin" &&
      req.user._id.toString() !== ticket.owner.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this ticket" });
    }

    // Aktualisiere die Felder
    if (status) {
      ticket.status = status;
    }

    if (assignedTo) {
      ticket.assignedTo = assignedTo;
    }

    // Speichere das aktualisierte Ticket
    await ticket.save();

    // Lade das aktualisierte Ticket mit Benutzerinformationen
    const updatedTicket = await Ticket.findById(ticketId)
      .populate("owner", "name email")
      .populate("assignedTo", "name email role")
      .populate("comments.author", "name email");

    res.status(200).json(updatedTicket);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update ticket",
      error: error.message,
    });
  }
};
