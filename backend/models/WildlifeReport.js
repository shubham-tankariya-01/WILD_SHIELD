const mongoose = require("mongoose");

const wildlifeReportSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    animal_type: {
      type: String,
      required: [true, "Animal type is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      address: { type: String, default: "" },
    },
    photo_url: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "verified", "assigned", "in_progress", "resolved", "rejected"],
      default: "pending",
    },
    assigned_team_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RescueTeam",
      default: null,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    reported_at: {
      type: Date,
      default: Date.now,
    },
    resolved_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

wildlifeReportSchema.index({ status: 1 });
wildlifeReportSchema.index({ user_id: 1 });
wildlifeReportSchema.index({ "location.lat": 1, "location.lng": 1 });

module.exports = mongoose.model("WildlifeReport", wildlifeReportSchema);
