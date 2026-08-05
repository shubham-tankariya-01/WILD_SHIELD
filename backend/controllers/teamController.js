const asyncHandler = require("express-async-handler");
const RescueTeam = require("../models/RescueTeam");

// @desc    Get all rescue teams
// @route   GET /api/teams
// @access  Admin
const getTeams = asyncHandler(async (req, res) => {
  const teams = await RescueTeam.find().sort({ team_name: 1 });
  res.json(teams);
});

// @desc    Create rescue team
// @route   POST /api/teams
// @access  Admin
const createTeam = asyncHandler(async (req, res) => {
  const team = await RescueTeam.create(req.body);
  res.status(201).json(team);
});

// @desc    Update rescue team
// @route   PUT /api/teams/:id
// @access  Admin
const updateTeam = asyncHandler(async (req, res) => {
  const team = await RescueTeam.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!team) {
    res.status(404);
    throw new Error("Rescue team not found");
  }
  res.json(team);
});

// @desc    Delete rescue team
// @route   DELETE /api/teams/:id
// @access  Admin
const deleteTeam = asyncHandler(async (req, res) => {
  const team = await RescueTeam.findByIdAndDelete(req.params.id);
  if (!team) {
    res.status(404);
    throw new Error("Rescue team not found");
  }
  res.json({ message: "Rescue team deleted" });
});

module.exports = { getTeams, createTeam, updateTeam, deleteTeam };
