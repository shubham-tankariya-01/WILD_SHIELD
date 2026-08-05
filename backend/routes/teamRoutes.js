const express = require("express");
const router = express.Router();
const { getTeams, createTeam, updateTeam, deleteTeam } = require("../controllers/teamController");
const { authMiddleware, requireRole } = require("../middleware/authMiddleware");

router.get("/", authMiddleware, requireRole("admin"), getTeams);
router.post("/", authMiddleware, requireRole("admin"), createTeam);
router.put("/:id", authMiddleware, requireRole("admin"), updateTeam);
router.delete("/:id", authMiddleware, requireRole("admin"), deleteTeam);

module.exports = router;
