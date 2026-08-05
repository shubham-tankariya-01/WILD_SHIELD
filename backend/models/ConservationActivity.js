const mongoose = require("mongoose");

const conservationActivitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Activity title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    location: {
      type: String,
      required: true,
    },
    organizer: {
      type: String,
    },
    volunteer_slots: {
      type: Number,
      required: true,
      min: 1,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

conservationActivitySchema.index({ date: 1 });

module.exports = mongoose.model("ConservationActivity", conservationActivitySchema);
