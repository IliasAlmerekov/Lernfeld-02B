import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const signToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const newUser = await User.create({ email, password });

    const token = signToken(newUser._id, newUser.role);

    res.status(201).json({ token });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Registration failed", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(410).json({ message: "Benutzer nicht gefunden" });

    const isMatch = await user.correctPassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Incorrect Password" });

    const token = signToken(user._id, user.role);

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};
