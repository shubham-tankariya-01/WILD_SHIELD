const mongoose = require("mongoose");

const animalSchema = new mongoose.Schema(
  {
    species_name: {
      type: String,
      required: [true, "Species name is required"],
      trim: true,
    },
    category: {
      type: String,
      enum: ["mammal", "bird", "reptile", "amphibian", "insect", "fish", "other"],
      required: true,
    },
    conservation_status: {
      type: String,
      enum: [
        "least_concern",
        "near_threatened",
        "vulnerable",
        "endangered",
        "critically_endangered",
        "extinct_in_wild",
      ],
      default: "least_concern",
    },
    info_description: {
      type: String,
    },
    image_url: {
      type: String,
    },
    habitat: {
      type: String,
    },
    region_found: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Animal", animalSchema);
