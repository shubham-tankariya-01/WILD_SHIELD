const express = require("express");
const router = express.Router();
const {
  createReport,
  getAllReports,
  getMyReports,
  getReportById,
  updateReportStatus,
  assignTeam,
  deleteReport,
} = require("../controllers/reportController");
const { authMiddleware, requireRole } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.post("/", authMiddleware, upload.single("photo"), createReport);
router.get("/", authMiddleware, requireRole("admin", "rescue_team"), getAllReports);
router.get("/mine", authMiddleware, getMyReports);
router.get("/:id", authMiddleware, getReportById);
router.patch("/:id/status", authMiddleware, requireRole("admin", "rescue_team"), updateReportStatus);
router.patch("/:id/assign", authMiddleware, requireRole("admin"), assignTeam);
router.delete("/:id", authMiddleware, deleteReport);

module.exports = router;
