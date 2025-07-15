import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import process from "process";
dotenv.config();

const signToken = (id, role, email, name) => {
  return jwt.sign({ id, role, email, name }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

// Registrierung eines neuen Benutzers
// Gibt ein Token und die User-ID zurück
export const register = async (req, res) => {
  try {
    const { email, password, role, name } = req.body;

    // name wird jetzt auch gespeichert
    const newUser = await User.create({ email, password, role, name });

    // name wird dem Token hinzugefügt
    const token = signToken(
      newUser._id,
      newUser.role,
      newUser.email,
      newUser.name
    );

    // Sende Token und User-ID zurück
    res.status(201).json({ token, userId: newUser._id });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Registration failed", error: error.message });
  }
};

// Login eines Benutzers
// Gibt ein Token und die User-ID zurück
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(410).json({ message: "User not found" });

    const isMatch = await user.correctPassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Incorrect Password" });

    const token = signToken(user._id, user.role, user.email, user.name);

    // Sende Token und User-ID zurück
    res.status(200).json({ token, userId: user._id });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};
