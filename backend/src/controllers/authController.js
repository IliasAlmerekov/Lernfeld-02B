import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import process from "process";
dotenv.config();

const signToken = (id, role, email) => {
  return jwt.sign({ id, role, email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

export const register = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const newUser = await User.create({ email, password, role });

    const token = signToken(newUser._id, newUser.role, newUser.email);

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
    if (!user) return res.status(410).json({ message: "User not found" });

    const isMatch = await user.correctPassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Incorrect Password" });

    const token = signToken(user._id, user.role, user.email);

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};
