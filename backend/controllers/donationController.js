const asyncHandler = require("express-async-handler");
const Donation = require("../models/Donation");
const crypto = require("crypto");

// @desc    Make a donation (mock payment)
// @route   POST /api/donations
// @access  Authenticated
const createDonation = asyncHandler(async (req, res) => {
  const { amount, purpose } = req.body;

  if (!amount || amount <= 0) {
    res.status(400);
    throw new Error("Please provide a valid donation amount");
  }

  // Generate mock transaction reference
  const transaction_ref = "TXN_" + crypto.randomBytes(8).toString("hex").toUpperCase();

  const donation = await Donation.create({
    user_id: req.user._id,
    amount,
    purpose: purpose || "general",
    payment_status: "success", // Mock: always succeeds
    transaction_ref,
  });

  res.status(201).json(donation);
});

// @desc    Get user's donation history
// @route   GET /api/donations/mine
// @access  Authenticated
const getMyDonations = asyncHandler(async (req, res) => {
  const donations = await Donation.find({ user_id: req.user._id })
    .sort({ donated_at: -1 });
  res.json(donations);
});

// @desc    Get all donations (admin)
// @route   GET /api/donations
// @access  Admin
const getAllDonations = asyncHandler(async (req, res) => {
  const donations = await Donation.find()
    .populate("user_id", "name email")
    .sort({ donated_at: -1 });
  res.json(donations);
});

module.exports = { createDonation, getMyDonations, getAllDonations };
