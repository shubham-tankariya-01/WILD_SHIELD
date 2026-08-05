const asyncHandler = require("express-async-handler");
const Animal = require("../models/Animal");

// @desc    Get all animals (public, filterable)
// @route   GET /api/animals
// @access  Public
const getAnimals = asyncHandler(async (req, res) => {
  const { category, conservation_status, search } = req.query;
  const query = {};

  if (category) query.category = category;
  if (conservation_status) query.conservation_status = conservation_status;
  if (search) {
    query.$or = [
      { species_name: { $regex: search, $options: "i" } },
      { info_description: { $regex: search, $options: "i" } },
      { habitat: { $regex: search, $options: "i" } },
    ];
  }

  const animals = await Animal.find(query).sort({ species_name: 1 });
  res.json(animals);
});

// @desc    Get single animal
// @route   GET /api/animals/:id
// @access  Public
const getAnimalById = asyncHandler(async (req, res) => {
  const animal = await Animal.findById(req.params.id);
  if (!animal) {
    res.status(404);
    throw new Error("Animal not found");
  }
  res.json(animal);
});

// @desc    Create new animal entry
// @route   POST /api/animals
// @access  Admin
const createAnimal = asyncHandler(async (req, res) => {
  const animal = await Animal.create(req.body);
  res.status(201).json(animal);
});

// @desc    Update animal entry
// @route   PUT /api/animals/:id
// @access  Admin
const updateAnimal = asyncHandler(async (req, res) => {
  const animal = await Animal.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!animal) {
    res.status(404);
    throw new Error("Animal not found");
  }
  res.json(animal);
});

// @desc    Delete animal entry
// @route   DELETE /api/animals/:id
// @access  Admin
const deleteAnimal = asyncHandler(async (req, res) => {
  const animal = await Animal.findByIdAndDelete(req.params.id);
  if (!animal) {
    res.status(404);
    throw new Error("Animal not found");
  }
  res.json({ message: "Animal entry deleted" });
});

module.exports = { getAnimals, getAnimalById, createAnimal, updateAnimal, deleteAnimal };
