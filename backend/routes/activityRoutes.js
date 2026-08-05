const express = require("express");
const router = express.Router();
const {
  getActivities,
  createActivity,
  joinActivity,
  leaveActivity,
  updateActivity,
  deleteActivity,
} = require("../controllers/activityController");
const { authMiddleware, requireRole } = require("../middleware/authMiddleware");

router.get("/", getActivities);
router.post("/", authMiddleware, requireRole("admin"), createActivity);
router.post("/:id/join", authMiddleware, joinActivity);
router.post("/:id/leave", authMiddleware, leaveActivity);
router.put("/:id", authMiddleware, requireRole("admin"), updateActivity);
router.delete("/:id", authMiddleware, requireRole("admin"), deleteActivity);

module.exports = router;
