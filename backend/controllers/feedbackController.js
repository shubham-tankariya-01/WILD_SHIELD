const asyncHandler = require("express-async-handler");
const Feedback = require("../models/Feedback");

// @desc    Submit feedback
// @route   POST /api/feedback
// @access  Authenticated
const createFeedback = asyncHandler(async (req, res) => {
  const { report_id, message, rating } = req.body;

  if (!message) {
    res.status(400);
    throw new Error("Feedback message is required");
  }

  const feedback = await Feedback.create({
    user_id: req.user._id,
    report_id: report_id || null,
    message,
    rating: rating || null,
  });

  res.status(201).json(feedback);
});

// @desc    Get all feedback (admin)
// @route   GET /api/feedback
// @access  Admin
const getAllFeedback = asyncHandler(async (req, res) => {
  const feedback = await Feedback.find()
    .populate("user_id", "name email")
    .populate("report_id", "animal_type status")
    .sort({ submitted_at: -1 });
  res.json(feedback);
});

// @desc    Get feedback for a specific report
// @route   GET /api/feedback/report/:report_id
// @access  Admin, Report Owner
const getFeedbackByReport = asyncHandler(async (req, res) => {
  const feedback = await Feedback.find({ report_id: req.params.report_id })
    .populate("user_id", "name email")
    .sort({ submitted_at: -1 });
  res.json(feedback);
});

module.exports = { createFeedback, getAllFeedback, getFeedbackByReport };
