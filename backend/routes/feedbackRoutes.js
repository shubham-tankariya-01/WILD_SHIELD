const express = require("express");
const router = express.Router();
const { createFeedback, getAllFeedback, getFeedbackByReport } = require("../controllers/feedbackController");
const { authMiddleware, requireRole } = require("../middleware/authMiddleware");

router.post("/", authMiddleware, createFeedback);
router.get("/", authMiddleware, requireRole("admin"), getAllFeedback);
router.get("/report/:report_id", authMiddleware, getFeedbackByReport);

module.exports = router;
