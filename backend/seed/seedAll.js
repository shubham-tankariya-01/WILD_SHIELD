const mongoose = require("mongoose");
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const User = require("../models/User");
const RescueTeam = require("../models/RescueTeam");
const ConservationActivity = require("../models/ConservationActivity");
const WildlifeReport = require("../models/WildlifeReport");
const Donation = require("../models/Donation");

const seedAll = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // ---- Admin User ----
    let admin = await User.findOne({ email: "admin@wildshield.com" });
    if (!admin) {
      admin = await User.create({
        name: "Admin User",
        email: "admin@wildshield.com",
        password_hash: "admin123",
        phone: "9876543210",
        role: "admin",
      });
      console.log("👤 Admin user created (admin@wildshield.com / admin123)");
    } else {
      console.log("👤 Admin user already exists");
    }

    // ---- Demo Citizen ----
    let citizen = await User.findOne({ email: "citizen@wildshield.com" });
    if (!citizen) {
      citizen = await User.create({
        name: "Aarav Sharma",
        email: "citizen@wildshield.com",
        password_hash: "citizen123",
        phone: "9876543211",
        role: "citizen",
      });
      console.log("👤 Demo citizen created (citizen@wildshield.com / citizen123)");
    }

    // ---- Demo Volunteer ----
    let volunteer = await User.findOne({ email: "volunteer@wildshield.com" });
    if (!volunteer) {
      volunteer = await User.create({
        name: "Priya Patel",
        email: "volunteer@wildshield.com",
        password_hash: "volunteer123",
        phone: "9876543212",
        role: "volunteer",
      });
      console.log("👤 Demo volunteer created (volunteer@wildshield.com / volunteer123)");
    }

    // ---- Rescue Teams ----
    await RescueTeam.deleteMany({});
    const teams = await RescueTeam.insertMany([
      {
        team_name: "Gujarat Wildlife Rescue Unit",
        region_assigned: "Ahmedabad Zone",
        contact_info: "rescue.ahmedabad@wildshield.com",
        availability_status: "available",
      },
      {
        team_name: "Western Ghats Rapid Response",
        region_assigned: "Pune-Nashik Zone",
        contact_info: "rescue.pune@wildshield.com",
        availability_status: "available",
      },
      {
        team_name: "Kaziranga Conservation Force",
        region_assigned: "Assam Zone",
        contact_info: "rescue.assam@wildshield.com",
        availability_status: "busy",
      },
      {
        team_name: "Himalayan Wildlife Guardians",
        region_assigned: "Uttarakhand Zone",
        contact_info: "rescue.uttarakhand@wildshield.com",
        availability_status: "available",
      },
      {
        team_name: "Sundarbans Tiger Patrol",
        region_assigned: "West Bengal Coastal Zone",
        contact_info: "rescue.sundarbans@wildshield.com",
        availability_status: "available",
      },
    ]);
    console.log(`🚑 Seeded ${teams.length} rescue teams`);

    // ---- Conservation Activities ----
    await ConservationActivity.deleteMany({});
    const activities = await ConservationActivity.insertMany([
      {
        title: "Mangrove Plantation Drive",
        description: "Join us in planting 1000 mangrove saplings along the coastal belt to restore critical wildlife habitats and protect against coastal erosion.",
        date: new Date("2026-09-15"),
        location: "Sundarbans, West Bengal",
        organizer: "Wild Shield Foundation",
        volunteer_slots: 50,
        participants: [],
      },
      {
        title: "Wildlife Census Volunteer Program",
        description: "Help us count and document wildlife species in Ranthambore National Park. Training will be provided. Camera traps and binoculars supplied.",
        date: new Date("2026-10-05"),
        location: "Ranthambore National Park, Rajasthan",
        organizer: "Wild Shield Foundation",
        volunteer_slots: 30,
        participants: [],
      },
      {
        title: "Beach Cleanup for Sea Turtles",
        description: "Clean Gahirmatha beach to provide safe nesting grounds for Olive Ridley sea turtles during their annual nesting season.",
        date: new Date("2026-11-20"),
        location: "Gahirmatha, Odisha",
        organizer: "Wild Shield Foundation",
        volunteer_slots: 40,
        participants: [],
      },
      {
        title: "Anti-Poaching Awareness Workshop",
        description: "A day-long workshop on anti-poaching techniques, wildlife law, and how communities can help protect endangered species.",
        date: new Date("2026-08-25"),
        location: "Jim Corbett National Park, Uttarakhand",
        organizer: "Wild Shield Foundation",
        volunteer_slots: 25,
        participants: [],
      },
    ]);
    console.log(`🌿 Seeded ${activities.length} conservation activities`);

    // ---- Sample Reports ----
    await WildlifeReport.deleteMany({});
    const reports = await WildlifeReport.insertMany([
      {
        user_id: citizen._id,
        animal_type: "Indian Peafowl",
        description: "Found injured near the roadside, appears to have a wing injury. Unable to fly. Needs immediate attention.",
        location: { lat: 23.0225, lng: 72.5714, address: "SG Highway, Ahmedabad, Gujarat" },
        status: "pending",
        priority: "high",
      },
      {
        user_id: citizen._id,
        animal_type: "Indian Cobra",
        description: "Spotted a cobra trapped in a construction site drainage pipe. Still alive but distressed.",
        location: { lat: 23.0396, lng: 72.5660, address: "Science City Road, Ahmedabad" },
        status: "verified",
        priority: "critical",
      },
      {
        user_id: volunteer._id,
        animal_type: "Bengal Tiger",
        description: "Tiger spotted near village boundary, appears injured on hind leg. Villagers are worried.",
        location: { lat: 26.0173, lng: 76.5026, address: "Near Ranthambore, Rajasthan" },
        status: "assigned",
        assigned_team_id: teams[0]._id,
        priority: "critical",
      },
      {
        user_id: citizen._id,
        animal_type: "Indian Star Tortoise",
        description: "Found a star tortoise while gardening. It seems healthy but may be displaced.",
        location: { lat: 19.0760, lng: 72.8777, address: "Andheri West, Mumbai" },
        status: "resolved",
        assigned_team_id: teams[1]._id,
        priority: "low",
        resolved_at: new Date("2026-07-20"),
      },
      {
        user_id: volunteer._id,
        animal_type: "Great Indian Bustard",
        description: "Spotted a bustard entangled in a fence wire near a wind farm. Immediate rescue needed.",
        location: { lat: 27.0238, lng: 70.6600, address: "Desert National Park, Jaisalmer" },
        status: "in_progress",
        assigned_team_id: teams[0]._id,
        priority: "critical",
      },
    ]);
    console.log(`📋 Seeded ${reports.length} sample reports`);

    // ---- Sample Donations ----
    await Donation.deleteMany({});
    const donations = await Donation.insertMany([
      { user_id: citizen._id, amount: 500, purpose: "rescue", payment_status: "success", transaction_ref: "TXN_DEMO001" },
      { user_id: volunteer._id, amount: 1000, purpose: "conservation", payment_status: "success", transaction_ref: "TXN_DEMO002" },
      { user_id: citizen._id, amount: 2500, purpose: "general", payment_status: "success", transaction_ref: "TXN_DEMO003" },
    ]);
    console.log(`💰 Seeded ${donations.length} sample donations`);

    console.log("\n✅ All seed data inserted successfully!");
    console.log("\n--- Login Credentials ---");
    console.log("Admin:     admin@wildshield.com / admin123");
    console.log("Citizen:   citizen@wildshield.com / citizen123");
    console.log("Volunteer: volunteer@wildshield.com / volunteer123");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error.stack || error);
    process.exit(1);
  }
};

seedAll();
