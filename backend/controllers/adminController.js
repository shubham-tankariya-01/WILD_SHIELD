const asyncHandler = require("express-async-handler");
const WildlifeReport = require("../models/WildlifeReport");
const User = require("../models/User");
const RescueTeam = require("../models/RescueTeam");
const Donation = require("../models/Donation");
const ConservationActivity = require("../models/ConservationActivity");
const Animal = require("../models/Animal");

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Admin
const getStats = asyncHandler(async (req, res) => {
  const [
    totalReports,
    pendingReports,
    resolvedReports,
    totalUsers,
    totalDonations,
    totalActivities,
    activeTeams,
    totalAnimals,
    reportsByStatus,
    reportsByMonth,
  ] = await Promise.all([
    WildlifeReport.countDocuments(),
    WildlifeReport.countDocuments({ status: "pending" }),
    WildlifeReport.countDocuments({ status: "resolved" }),
    User.countDocuments(),
    Donation.aggregate([
      { $match: { payment_status: "success" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    ConservationActivity.countDocuments(),
    RescueTeam.countDocuments({ availability_status: "available" }),
    Animal.countDocuments(),
    WildlifeReport.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
    WildlifeReport.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$reported_at" },
            month: { $month: "$reported_at" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 12 },
    ]),
  ]);

  const resolutionRate =
    totalReports > 0
      ? ((resolvedReports / totalReports) * 100).toFixed(1)
      : "0";

  res.json({
    total_reports: totalReports,
    pending_reports: pendingReports,
    resolved_reports: resolvedReports,
    resolution_rate: `${resolutionRate}%`,
    total_users: totalUsers,
    total_donations: totalDonations[0]?.total || 0,
    total_activities: totalActivities,
    active_rescue_teams: activeTeams,
    total_animals: totalAnimals,
    reports_by_status: reportsByStatus,
    reports_by_month: reportsByMonth,
  });
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ created_at: -1 });
  res.json(users);
});

// @desc    Change user role
// @route   PATCH /api/admin/users/:id/role
// @access  Admin
const changeUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  const validRoles = ["citizen", "volunteer", "rescue_team", "admin"];

  if (!validRoles.includes(role)) {
    res.status(400);
    throw new Error("Invalid role");
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true }
  );

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json(user);
});

module.exports = { getStats, getUsers, changeUserRole };
