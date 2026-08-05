const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    report_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WildlifeReport",
    },
    message: {
      type: String,
      required: [true, "Feedback message is required"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    submitted_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Feedback", feedbackSchema);
