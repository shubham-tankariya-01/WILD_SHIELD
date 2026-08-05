const express = require("express");
const router = express.Router();
const { getStats, getUsers, changeUserRole } = require("../controllers/adminController");
const { authMiddleware, requireRole } = require("../middleware/authMiddleware");

router.get("/stats", authMiddleware, requireRole("admin"), getStats);
router.get("/users", authMiddleware, requireRole("admin"), getUsers);
router.patch("/users/:id/role", authMiddleware, requireRole("admin"), changeUserRole);

module.exports = router;
