import jwt from "jsonwebtoken";
import User from "../models/User.js";

function createToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

function userResponse(user) {
  return {
    token: createToken(user._id),
    user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin }
  };
}

export async function register(req, res) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required" });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }
  if (await User.exists({ email: email.toLowerCase() })) {
    return res.status(409).json({ message: "An account already exists for this email" });
  }

  const user = await User.create({ name, email, password });
  res.status(201).json(userResponse(user));
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email?.toLowerCase() }).select("+password");
  if (!user || !(await user.comparePassword(password || ""))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  res.json(userResponse(user));
}

export async function profile(req, res) {
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    isAdmin: req.user.isAdmin
  });
}

export async function listUsers(req, res) {
  const users = await User.find().sort({ createdAt: -1 });
  res.json(
    users.map((user) => ({
      id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt
    }))
  );
}
