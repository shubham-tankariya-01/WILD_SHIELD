const asyncHandler = require("express-async-handler");
const ConservationActivity = require("../models/ConservationActivity");

// @desc    Get all activities
// @route   GET /api/activities
// @access  Public
const getActivities = asyncHandler(async (req, res) => {
  const activities = await ConservationActivity.find()
    .populate("participants", "name email")
    .sort({ date: -1 });
  res.json(activities);
});

// @desc    Create activity
// @route   POST /api/activities
// @access  Admin
const createActivity = asyncHandler(async (req, res) => {
  const activity = await ConservationActivity.create(req.body);
  res.status(201).json(activity);
});

// @desc    Join activity
// @route   POST /api/activities/:id/join
// @access  Authenticated
const joinActivity = asyncHandler(async (req, res) => {
  const activity = await ConservationActivity.findById(req.params.id);
  if (!activity) {
    res.status(404);
    throw new Error("Activity not found");
  }

  // Check if already joined
  if (activity.participants.includes(req.user._id)) {
    res.status(400);
    throw new Error("You have already joined this activity");
  }

  // Check if slots are full
  if (activity.participants.length >= activity.volunteer_slots) {
    res.status(400);
    throw new Error("Activity is full, no slots available");
  }

  activity.participants.push(req.user._id);
  await activity.save();

  const updated = await ConservationActivity.findById(req.params.id)
    .populate("participants", "name email");

  res.json(updated);
});

// @desc    Leave activity
// @route   POST /api/activities/:id/leave
// @access  Authenticated
const leaveActivity = asyncHandler(async (req, res) => {
  const activity = await ConservationActivity.findById(req.params.id);
  if (!activity) {
    res.status(404);
    throw new Error("Activity not found");
  }

  const participantIndex = activity.participants.indexOf(req.user._id);
  if (participantIndex === -1) {
    res.status(400);
    throw new Error("You are not a participant in this activity");
  }

  activity.participants.splice(participantIndex, 1);
  await activity.save();

  const updated = await ConservationActivity.findById(req.params.id)
    .populate("participants", "name email");

  res.json(updated);
});

// @desc    Update activity
// @route   PUT /api/activities/:id
// @access  Admin
const updateActivity = asyncHandler(async (req, res) => {
  const activity = await ConservationActivity.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  if (!activity) {
    res.status(404);
    throw new Error("Activity not found");
  }
  res.json(activity);
});

// @desc    Delete activity
// @route   DELETE /api/activities/:id
// @access  Admin
const deleteActivity = asyncHandler(async (req, res) => {
  const activity = await ConservationActivity.findByIdAndDelete(req.params.id);
  if (!activity) {
    res.status(404);
    throw new Error("Activity not found");
  }
  res.json({ message: "Activity deleted" });
});

module.exports = {
  getActivities,
  createActivity,
  joinActivity,
  leaveActivity,
  updateActivity,
  deleteActivity,
};
