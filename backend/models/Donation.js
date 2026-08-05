const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: [true, "Donation amount is required"],
      min: [1, "Amount must be at least 1"],
    },
    purpose: {
      type: String,
      enum: ["rescue", "conservation", "general"],
      default: "general",
    },
    payment_status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    donated_at: {
      type: Date,
      default: Date.now,
    },
    transaction_ref: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

donationSchema.index({ user_id: 1 });

module.exports = mongoose.model("Donation", donationSchema);
