const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, role } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please provide name, email, and password");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error("User already exists with this email");
  }

  // Only allow citizen and volunteer roles on registration
  const allowedRoles = ["citizen", "volunteer"];
  const userRole = allowedRoles.includes(role) ? role : "citizen";

  const user = await User.create({
    name,
    email,
    password_hash: password, // Will be hashed by pre-save hook
    phone,
    role: userRole,
  });

  const token = generateToken(user);

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    token,
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }

  const user = await User.findOne({ email }).select("+password_hash");
  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const demoEmails = [
    "admin@wildshield.com",
    "citizen1@wildshield.com",
    "volunteer1@wildshield.com"
  ];

  let isMatch = false;
  
  // Bypass authentication system for demo users
  if (demoEmails.includes(email)) {
    isMatch = true;
  } else {
    isMatch = await user.comparePassword(password);
  }

  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const token = generateToken(user);

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    profile_photo_url: user.profile_photo_url,
    token,
  });
});

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.json(req.user);
});

module.exports = { register, login, getMe };
