const asyncHandler = require("express-async-handler");
const WildlifeReport = require("../models/WildlifeReport");

// @desc    Submit new report
// @route   POST /api/reports
// @access  Authenticated
const createReport = asyncHandler(async (req, res) => {
  const { animal_type, description, lat, lng, address, priority } = req.body;

  if (!animal_type || !description || !lat || !lng) {
    res.status(400);
    throw new Error("Please provide animal type, description, and location");
  }

  let photo_url = null;
  if (req.file) {
    photo_url = `/uploads/${req.file.filename}`;
  }

  const report = await WildlifeReport.create({
    user_id: req.user._id,
    animal_type,
    description,
    location: {
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      address: address || "",
    },
    photo_url,
    priority: priority || "medium",
  });

  res.status(201).json(report);
});

// @desc    Get all reports (admin/rescue_team)
// @route   GET /api/reports
// @access  Admin, Rescue Team
const getAllReports = asyncHandler(async (req, res) => {
  const { status, priority, page = 1, limit = 20 } = req.query;
  const query = {};

  if (status) query.status = status;
  if (priority) query.priority = priority;

  // Rescue teams only see reports assigned to them
  if (req.user.role === "rescue_team") {
    query.assigned_team_id = { $ne: null };
  }

  const reports = await WildlifeReport.find(query)
    .populate("user_id", "name email phone")
    .populate("assigned_team_id", "team_name region_assigned")
    .sort({ reported_at: -1 })
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));

  const total = await WildlifeReport.countDocuments(query);

  res.json({
    reports,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / parseInt(limit)),
  });
});

// @desc    Get user's own reports
// @route   GET /api/reports/mine
// @access  Authenticated
const getMyReports = asyncHandler(async (req, res) => {
  const reports = await WildlifeReport.find({ user_id: req.user._id })
    .populate("assigned_team_id", "team_name region_assigned")
    .sort({ reported_at: -1 });

  res.json(reports);
});

// @desc    Get single report
// @route   GET /api/reports/:id
// @access  Authenticated
const getReportById = asyncHandler(async (req, res) => {
  const report = await WildlifeReport.findById(req.params.id)
    .populate("user_id", "name email phone")
    .populate("assigned_team_id", "team_name region_assigned contact_info");

  if (!report) {
    res.status(404);
    throw new Error("Report not found");
  }

  // Citizens can only view their own reports
  if (
    req.user.role === "citizen" &&
    report.user_id._id.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error("Not authorized to view this report");
  }

  res.json(report);
});

// @desc    Update report status
// @route   PATCH /api/reports/:id/status
// @access  Admin, Rescue Team
const updateReportStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = ["pending", "verified", "assigned", "in_progress", "resolved", "rejected"];

  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error("Invalid status value");
  }

  const report = await WildlifeReport.findById(req.params.id);
  if (!report) {
    res.status(404);
    throw new Error("Report not found");
  }

  report.status = status;
  if (status === "resolved") {
    report.resolved_at = new Date();
  }

  await report.save();

  const updatedReport = await WildlifeReport.findById(req.params.id)
    .populate("user_id", "name email")
    .populate("assigned_team_id", "team_name region_assigned");

  res.json(updatedReport);
});

// @desc    Assign rescue team to report
// @route   PATCH /api/reports/:id/assign
// @access  Admin
const assignTeam = asyncHandler(async (req, res) => {
  const { team_id } = req.body;

  const report = await WildlifeReport.findById(req.params.id);
  if (!report) {
    res.status(404);
    throw new Error("Report not found");
  }

  report.assigned_team_id = team_id;
  report.status = "assigned";
  await report.save();

  const updatedReport = await WildlifeReport.findById(req.params.id)
    .populate("user_id", "name email")
    .populate("assigned_team_id", "team_name region_assigned");

  res.json(updatedReport);
});

// @desc    Delete report
// @route   DELETE /api/reports/:id
// @access  Admin, Owner (if pending)
const deleteReport = asyncHandler(async (req, res) => {
  const report = await WildlifeReport.findById(req.params.id);
  if (!report) {
    res.status(404);
    throw new Error("Report not found");
  }

  // Citizens can only delete their own pending reports
  if (req.user.role !== "admin") {
    if (report.user_id.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized to delete this report");
    }
    if (report.status !== "pending") {
      res.status(400);
      throw new Error("Can only delete pending reports");
    }
  }

  await WildlifeReport.findByIdAndDelete(req.params.id);
  res.json({ message: "Report deleted successfully" });
});

module.exports = {
  createReport,
  getAllReports,
  getMyReports,
  getReportById,
  updateReportStatus,
  assignTeam,
  deleteReport,
};
