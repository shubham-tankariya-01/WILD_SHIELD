const express = require("express");
const router = express.Router();
const {
  getAnimals,
  getAnimalById,
  createAnimal,
  updateAnimal,
  deleteAnimal,
} = require("../controllers/animalController");
const { authMiddleware, requireRole } = require("../middleware/authMiddleware");

router.get("/", getAnimals);
router.get("/:id", getAnimalById);
router.post("/", authMiddleware, requireRole("admin"), createAnimal);
router.put("/:id", authMiddleware, requireRole("admin"), updateAnimal);
router.delete("/:id", authMiddleware, requireRole("admin"), deleteAnimal);

module.exports = router;
