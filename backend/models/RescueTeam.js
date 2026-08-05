const mongoose = require("mongoose");

const rescueTeamSchema = new mongoose.Schema(
  {
    team_name: {
      type: String,
      required: [true, "Team name is required"],
      trim: true,
    },
    region_assigned: {
      type: String,
      required: true,
    },
    contact_info: {
      type: String,
    },
    availability_status: {
      type: String,
      enum: ["available", "busy", "off_duty"],
      default: "available",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("RescueTeam", rescueTeamSchema);
