import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import process from "process";

import authRoutes from "./routes/authRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Authentifizierungs-Routen
app.use("/api/auth", authRoutes);

// Ticket-Routen
app.use("/api/tickets", ticketRoutes);

app.get("/", (req, res) => {
  res.send("API live");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server läuft auf Port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.error("Database connection error:", err));
