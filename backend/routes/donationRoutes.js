const express = require("express");
const router = express.Router();
const { createDonation, getMyDonations, getAllDonations } = require("../controllers/donationController");
const { authMiddleware, requireRole } = require("../middleware/authMiddleware");

router.post("/", authMiddleware, createDonation);
router.get("/mine", authMiddleware, getMyDonations);
router.get("/", authMiddleware, requireRole("admin"), getAllDonations);

module.exports = router;
