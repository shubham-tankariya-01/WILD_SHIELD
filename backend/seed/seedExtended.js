const mongoose = require("mongoose");
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const User = require("../models/User");
const RescueTeam = require("../models/RescueTeam");
const ConservationActivity = require("../models/ConservationActivity");
const WildlifeReport = require("../models/WildlifeReport");
const Donation = require("../models/Donation");
const Animal = require("../models/Animal");
const Feedback = require("../models/Feedback");

const seedAllExtended = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // ==========================================
    // 1. CLEANUP EXISTING DATA
    // ==========================================
    await User.deleteMany({});
    await RescueTeam.deleteMany({});
    await ConservationActivity.deleteMany({});
    await WildlifeReport.deleteMany({});
    await Donation.deleteMany({});
    await Animal.deleteMany({});
    await Feedback.deleteMany({});
    console.log("🧹 Cleared existing database");

    // ==========================================
    // 2. USERS
    // ==========================================
    const users = await User.insertMany([
      { name: "Admin Supervisor", email: "admin@wildshield.com", password_hash: "admin123", phone: "9876543210", role: "admin", profile_photo_url: "https://loremflickr.com/200/200/face,person" },
      { name: "Aarav Sharma", email: "citizen1@wildshield.com", password_hash: "citizen123", phone: "9876543211", role: "citizen", profile_photo_url: "https://loremflickr.com/200/200/face,man" },
      { name: "Neha Gupta", email: "citizen2@wildshield.com", password_hash: "citizen123", phone: "9876543212", role: "citizen", profile_photo_url: "https://loremflickr.com/200/200/face,woman" },
      { name: "Rohan Desai", email: "citizen3@wildshield.com", password_hash: "citizen123", phone: "9876543213", role: "citizen" },
      { name: "Priya Patel", email: "volunteer1@wildshield.com", password_hash: "volunteer123", phone: "9876543214", role: "volunteer", profile_photo_url: "https://loremflickr.com/200/200/face,girl" },
      { name: "Vikram Singh", email: "volunteer2@wildshield.com", password_hash: "volunteer123", phone: "9876543215", role: "volunteer", profile_photo_url: "https://loremflickr.com/200/200/face,boy" },
      { name: "Kavya Reddy", email: "volunteer3@wildshield.com", password_hash: "volunteer123", phone: "9876543216", role: "volunteer" },
    ]);
    const admin = users[0];
    const c1 = users[1]; const c2 = users[2]; const c3 = users[3];
    const v1 = users[4]; const v2 = users[5]; const v3 = users[6];
    console.log(`👤 Seeded ${users.length} users`);

    // ==========================================
    // 3. ANIMALS (WILDLIFE DATABASE)
    // ==========================================
    const animals = await Animal.insertMany([
      { species_name: "Bengal Tiger", category: "mammal", conservation_status: "endangered", info_description: "The Bengal tiger is a tiger from a specific population of the Panthera tigris tigris subspecies that is native to the Indian subcontinent.", habitat: "Tropical rainforests, mangroves, grasslands", region_found: "India, Bangladesh, Nepal", image_url: "https://loremflickr.com/800/600/tiger,wildlife" },
      { species_name: "Indian Leopard", category: "mammal", conservation_status: "vulnerable", info_description: "The Indian leopard is a leopard subspecies widely distributed on the Indian subcontinent.", habitat: "Forests, mountainous regions", region_found: "India, Nepal, Bhutan", image_url: "https://loremflickr.com/800/600/leopard,wildlife" },
      { species_name: "Indian Elephant", category: "mammal", conservation_status: "endangered", info_description: "One of three extant recognised subspecies of the Asian elephant and native to mainland Asia.", habitat: "Grasslands, deciduous forests", region_found: "India, Southeast Asia", image_url: "https://loremflickr.com/800/600/elephant,wildlife" },
      { species_name: "Indian Peafowl", category: "bird", conservation_status: "least_concern", info_description: "A large and brightly coloured bird, is a species of peafowl native to the Indian subcontinent.", habitat: "Deciduous forests, cultivated areas", region_found: "India, Sri Lanka", image_url: "https://loremflickr.com/800/600/peacock,wildlife" },
      { species_name: "King Cobra", category: "reptile", conservation_status: "vulnerable", info_description: "The world's longest venomous snake, endemic to forests from India through Southeast Asia.", habitat: "Dense highland forests, bamboo thickets", region_found: "India, Southeast Asia", image_url: "https://loremflickr.com/800/600/snake,wildlife" },
      { species_name: "Snow Leopard", category: "mammal", conservation_status: "vulnerable", info_description: "A large cat native to the mountain ranges of Central and South Asia.", habitat: "Alpine and subalpine zones", region_found: "Himalayas, Central Asia", image_url: "https://loremflickr.com/800/600/snowleopard,wildlife" },
      { species_name: "Great Indian Bustard", category: "bird", conservation_status: "critically_endangered", info_description: "A large bird with a horizontal body and long bare legs, giving it an ostrich-like appearance.", habitat: "Dry grasslands, scrublands", region_found: "Rajasthan, Gujarat", image_url: "https://loremflickr.com/800/600/bird,wildlife" },
      { species_name: "Indian Rhinoceros", category: "mammal", conservation_status: "vulnerable", info_description: "Also called the greater one-horned rhinoceros, native to the Indian subcontinent.", habitat: "Alluvial grasslands, riverine forests", region_found: "Assam, Nepal", image_url: "https://loremflickr.com/800/600/rhinoceros,wildlife" },
      { species_name: "Gharial", category: "reptile", conservation_status: "critically_endangered", info_description: "A crocodilian in the family Gavialidae and among the longest of all living crocodilians.", habitat: "Clear freshwater river systems", region_found: "Northern India, Nepal", image_url: "https://loremflickr.com/800/600/crocodile,wildlife" },
      { species_name: "Lion-tailed Macaque", category: "mammal", conservation_status: "endangered", info_description: "An Old World monkey endemic to the Western Ghats of South India.", habitat: "Tropical evergreen forests", region_found: "Western Ghats, India", image_url: "https://loremflickr.com/800/600/monkey,wildlife" },
      { species_name: "Indian Pangolin", category: "mammal", conservation_status: "endangered", info_description: "A pangolin native to the Indian subcontinent. It is solitary, shy, slow-moving, and nocturnal.", habitat: "Forests, grasslands", region_found: "India, Sri Lanka", image_url: "https://loremflickr.com/800/600/pangolin,wildlife" },
      { species_name: "Sloth Bear", category: "mammal", conservation_status: "vulnerable", info_description: "A myrmecophagous bear species native to the Indian subcontinent.", habitat: "Forests, scrublands", region_found: "India, Nepal, Sri Lanka", image_url: "https://loremflickr.com/800/600/bear,wildlife" },
      { species_name: "Sarus Crane", category: "bird", conservation_status: "vulnerable", info_description: "The tallest of the flying birds, standing at a height of up to 1.8 m.", habitat: "Wetlands, marshes", region_found: "Northern India, Southeast Asia", image_url: "https://loremflickr.com/800/600/crane,wildlife" },
      { species_name: "Red Panda", category: "mammal", conservation_status: "endangered", info_description: "A carnivoran native to the eastern Himalayas and southwestern China.", habitat: "Temperate forests with bamboo", region_found: "Himalayas", image_url: "https://loremflickr.com/800/600/redpanda,wildlife" },
      { species_name: "Olive Ridley Sea Turtle", category: "reptile", conservation_status: "vulnerable", info_description: "Known for their synchronized mass nestings called arribadas.", habitat: "Warm and tropical waters", region_found: "Odisha coast, global oceans", image_url: "https://loremflickr.com/800/600/turtle,wildlife" }
    ]);
    console.log(`🐾 Seeded ${animals.length} wildlife species with images`);

    // ==========================================
    // 4. RESCUE TEAMS
    // ==========================================
    const teams = await RescueTeam.insertMany([
      { team_name: "Gujarat Wildlife Rescue Unit", region_assigned: "Ahmedabad Zone", contact_info: "rescue.ahmedabad@wildshield.com", availability_status: "available" },
      { team_name: "Western Ghats Rapid Response", region_assigned: "Pune-Nashik Zone", contact_info: "rescue.pune@wildshield.com", availability_status: "available" },
      { team_name: "Kaziranga Conservation Force", region_assigned: "Assam Zone", contact_info: "rescue.assam@wildshield.com", availability_status: "busy" },
      { team_name: "Himalayan Wildlife Guardians", region_assigned: "Uttarakhand Zone", contact_info: "rescue.uttarakhand@wildshield.com", availability_status: "available" },
      { team_name: "Sundarbans Tiger Patrol", region_assigned: "West Bengal Coastal Zone", contact_info: "rescue.sundarbans@wildshield.com", availability_status: "busy" },
      { team_name: "Deccan Plateau Rescue", region_assigned: "Hyderabad Zone", contact_info: "rescue.hyd@wildshield.com", availability_status: "available" },
      { team_name: "Thar Desert Rangers", region_assigned: "Rajasthan Zone", contact_info: "rescue.raj@wildshield.com", availability_status: "busy" },
      { team_name: "Nilgiri Biosphere Response", region_assigned: "Ooty-Coimbatore Zone", contact_info: "rescue.nilgiri@wildshield.com", availability_status: "available" },
      { team_name: "Andaman Marine Rescue", region_assigned: "Andaman Islands", contact_info: "rescue.andaman@wildshield.com", availability_status: "available" },
      { team_name: "Gir Lion Protection Force", region_assigned: "Saurashtra Zone", contact_info: "rescue.gir@wildshield.com", availability_status: "busy" }
    ]);
    console.log(`🚑 Seeded ${teams.length} rescue teams`);

    // ==========================================
    // 5. CONSERVATION ACTIVITIES
    // ==========================================
    const activities = await ConservationActivity.insertMany([
      { title: "Mangrove Plantation Drive", description: "Join us in planting 1000 mangrove saplings along the coastal belt to restore critical wildlife habitats and protect against coastal erosion. Tools and lunch provided.", date: new Date(Date.now() + 86400000 * 10), location: "Sundarbans, West Bengal", organizer: "Wild Shield Foundation", volunteer_slots: 50, participants: [v1._id, v2._id, c1._id] },
      { title: "Wildlife Census Volunteer Program", description: "Help us count and document wildlife species in Ranthambore National Park. Training will be provided. Camera traps and binoculars supplied.", date: new Date(Date.now() + 86400000 * 25), location: "Ranthambore National Park, Rajasthan", organizer: "Wild Shield Foundation", volunteer_slots: 30, participants: [v3._id] },
      { title: "Beach Cleanup for Sea Turtles", description: "Clean Gahirmatha beach to provide safe nesting grounds for Olive Ridley sea turtles during their annual nesting season.", date: new Date(Date.now() + 86400000 * 45), location: "Gahirmatha, Odisha", organizer: "Wild Shield Foundation", volunteer_slots: 40, participants: [c2._id, c3._id, v1._id, v2._id] },
      { title: "Anti-Poaching Awareness Workshop", description: "A day-long workshop on anti-poaching techniques, wildlife law, and how communities can help protect endangered species.", date: new Date(Date.now() - 86400000 * 5), location: "Jim Corbett National Park, Uttarakhand", organizer: "Wild Shield Foundation", volunteer_slots: 25, participants: [c1._id, v1._id, v3._id] },
      { title: "Urban Bird Habitat Construction", description: "Build and install birdhouses and water baths in local parks to support urban avian biodiversity during the summer heat.", date: new Date(Date.now() + 86400000 * 15), location: "Cubbon Park, Bengaluru", organizer: "EcoRoots India", volunteer_slots: 20, participants: [] },
      { title: "Forest Fire Prevention Line Clearing", description: "Assist forest guards in clearing dry brush to create fire lines before the dry season peaks. High physical endurance required.", date: new Date(Date.now() + 86400000 * 60), location: "Bandipur National Park, Karnataka", organizer: "Karnataka Forest Dept", volunteer_slots: 15, participants: [v2._id] },
      { title: "River Cleaning for Gharial Habitat", description: "Remove plastic waste and debris from the Chambal river banks to protect the nesting sites of the critically endangered Gharial.", date: new Date(Date.now() + 86400000 * 30), location: "National Chambal Sanctuary, UP", organizer: "Gharial Conservation Alliance", volunteer_slots: 35, participants: [c1._id, c2._id] },
      { title: "Leopard-Human Conflict Mitigation Seminar", description: "Learn how to safely coexist with leopards in fringe areas. Ideal for residents of bordering villages and housing societies.", date: new Date(Date.now() + 86400000 * 7), location: "Sanjay Gandhi National Park, Mumbai", organizer: "Wild Shield Foundation", volunteer_slots: 100, participants: [c3._id, v1._id, v2._id, v3._id] },
    ]);
    console.log(`🌿 Seeded ${activities.length} conservation activities`);

    // ==========================================
    // 6. WILDLIFE REPORTS
    // ==========================================
    const reports = await WildlifeReport.insertMany([
      { user_id: c1._id, animal_type: "Indian Peafowl", description: "Found injured near the roadside, appears to have a wing injury. Unable to fly. Needs immediate attention.", location: { lat: 23.0225, lng: 72.5714, address: "SG Highway, Ahmedabad, Gujarat" }, status: "pending", priority: "high", photo_url: "https://loremflickr.com/800/600/peacock,injured", reported_at: new Date(Date.now() - 86400000 * 1) },
      { user_id: c2._id, animal_type: "Indian Cobra", description: "Spotted a cobra trapped in a construction site drainage pipe. Still alive but distressed.", location: { lat: 23.0396, lng: 72.5660, address: "Science City Road, Ahmedabad" }, status: "verified", priority: "critical", photo_url: "https://loremflickr.com/800/600/snake,trapped", reported_at: new Date(Date.now() - 86400000 * 2) },
      { user_id: v1._id, animal_type: "Bengal Tiger", description: "Tiger spotted near village boundary, appears injured on hind leg. Villagers are worried.", location: { lat: 26.0173, lng: 76.5026, address: "Near Ranthambore, Rajasthan" }, status: "assigned", assigned_team_id: teams[6]._id, priority: "critical", photo_url: "https://loremflickr.com/800/600/tiger", reported_at: new Date(Date.now() - 86400000 * 3) },
      { user_id: c3._id, animal_type: "Indian Star Tortoise", description: "Found a star tortoise while gardening. It seems healthy but may be displaced.", location: { lat: 19.0760, lng: 72.8777, address: "Andheri West, Mumbai" }, status: "resolved", assigned_team_id: teams[1]._id, priority: "low", photo_url: "https://loremflickr.com/800/600/tortoise", reported_at: new Date(Date.now() - 86400000 * 30), resolved_at: new Date(Date.now() - 86400000 * 28) },
      { user_id: v2._id, animal_type: "Great Indian Bustard", description: "Spotted a bustard entangled in a fence wire near a wind farm. Immediate rescue needed.", location: { lat: 27.0238, lng: 70.6600, address: "Desert National Park, Jaisalmer" }, status: "in_progress", assigned_team_id: teams[6]._id, priority: "critical", reported_at: new Date(Date.now() - 86400000 * 1) },
      { user_id: c1._id, animal_type: "Indian Leopard", description: "Leopard resting on a tree branch near a tea estate. Does not seem aggressive, but people are panicking.", location: { lat: 11.4064, lng: 76.6932, address: "Coonoor, Tamil Nadu" }, status: "assigned", assigned_team_id: teams[7]._id, priority: "high", photo_url: "https://loremflickr.com/800/600/leopard", reported_at: new Date(Date.now() - 86400000 * 0.5) },
      { user_id: v3._id, animal_type: "Sloth Bear", description: "Bear wandered into a village searching for food. Currently cornered in an empty shed.", location: { lat: 15.3173, lng: 75.7139, address: "Near Hubli, Karnataka" }, status: "in_progress", assigned_team_id: teams[5]._id, priority: "critical", reported_at: new Date(Date.now() - 86400000 * 0.1) },
      { user_id: c2._id, animal_type: "Sarus Crane", description: "Young crane separated from flock, appears dehydrated in an empty field.", location: { lat: 26.8467, lng: 80.9462, address: "Lucknow outskirts, UP" }, status: "pending", priority: "medium", photo_url: "https://loremflickr.com/800/600/crane,bird", reported_at: new Date(Date.now() - 86400000 * 0.2) },
      { user_id: c3._id, animal_type: "Rhesus Macaque", description: "Monkey electrocuted on a power line, barely breathing.", location: { lat: 28.7041, lng: 77.1025, address: "North Delhi" }, status: "resolved", assigned_team_id: teams[3]._id, priority: "critical", photo_url: "https://loremflickr.com/800/600/monkey,injured", reported_at: new Date(Date.now() - 86400000 * 15), resolved_at: new Date(Date.now() - 86400000 * 14) },
      { user_id: v1._id, animal_type: "Indian Elephant", description: "Elephant calf stuck in a muddy ditch, mother is nearby and agitated.", location: { lat: 26.7509, lng: 94.2037, address: "Jorhat, Assam" }, status: "resolved", assigned_team_id: teams[2]._id, priority: "critical", photo_url: "https://loremflickr.com/800/600/elephant,mud", reported_at: new Date(Date.now() - 86400000 * 45), resolved_at: new Date(Date.now() - 86400000 * 44) },
      { user_id: c1._id, animal_type: "Monitor Lizard", description: "Large lizard found inside a school compound. Needs relocation.", location: { lat: 12.9716, lng: 77.5946, address: "Bengaluru, Karnataka" }, status: "resolved", assigned_team_id: teams[1]._id, priority: "medium", reported_at: new Date(Date.now() - 86400000 * 20), resolved_at: new Date(Date.now() - 86400000 * 19) },
      { user_id: v2._id, animal_type: "Indian Pangolin", description: "Rescued a pangolin from suspected poachers, holding it securely. Needs urgent pickup by forest dept.", location: { lat: 19.8968, lng: 75.3213, address: "Aurangabad, Maharashtra" }, status: "assigned", assigned_team_id: teams[1]._id, priority: "critical", photo_url: "https://loremflickr.com/800/600/pangolin", reported_at: new Date(Date.now() - 86400000 * 1) },
      { user_id: c2._id, animal_type: "Barn Owl", description: "Owl trapped in attic netting, wings tangled.", location: { lat: 22.5726, lng: 88.3639, address: "Kolkata, West Bengal" }, status: "pending", priority: "high", reported_at: new Date(Date.now() - 86400000 * 0.05) },
      { user_id: c3._id, animal_type: "Spotted Deer", description: "Deer hit by a vehicle on the highway, bleeding but conscious.", location: { lat: 30.3165, lng: 78.0322, address: "Dehradun-Rishikesh Highway" }, status: "in_progress", assigned_team_id: teams[3]._id, priority: "critical", photo_url: "https://loremflickr.com/800/600/deer,road", reported_at: new Date(Date.now() - 86400000 * 0.2) },
      { user_id: v3._id, animal_type: "Russell's Viper", description: "Highly venomous snake in a residential garden.", location: { lat: 13.0827, lng: 80.2707, address: "Chennai, Tamil Nadu" }, status: "resolved", assigned_team_id: teams[1]._id, priority: "high", reported_at: new Date(Date.now() - 86400000 * 60), resolved_at: new Date(Date.now() - 86400000 * 60) },
    ]);
    console.log(`📋 Seeded ${reports.length} extensive wildlife reports`);

    // ==========================================
    // 7. DONATIONS
    // ==========================================
    const donations = await Donation.insertMany([
      { user_id: c1._id, amount: 500, purpose: "rescue", payment_status: "success", transaction_ref: "TXN_DEMO_001", donated_at: new Date(Date.now() - 86400000 * 10) },
      { user_id: v1._id, amount: 1000, purpose: "conservation", payment_status: "success", transaction_ref: "TXN_DEMO_002", donated_at: new Date(Date.now() - 86400000 * 25) },
      { user_id: c2._id, amount: 2500, purpose: "general", payment_status: "success", transaction_ref: "TXN_DEMO_003", donated_at: new Date(Date.now() - 86400000 * 5) },
      { user_id: c3._id, amount: 10000, purpose: "rescue", payment_status: "success", transaction_ref: "TXN_DEMO_004", donated_at: new Date(Date.now() - 86400000 * 40) },
      { user_id: v2._id, amount: 5000, purpose: "general", payment_status: "success", transaction_ref: "TXN_DEMO_005", donated_at: new Date(Date.now() - 86400000 * 15) },
      { user_id: c1._id, amount: 1500, purpose: "conservation", payment_status: "success", transaction_ref: "TXN_DEMO_006", donated_at: new Date(Date.now() - 86400000 * 2) },
      { user_id: v3._id, amount: 2000, purpose: "rescue", payment_status: "success", transaction_ref: "TXN_DEMO_007", donated_at: new Date(Date.now() - 86400000 * 1) },
      { user_id: c2._id, amount: 500, purpose: "general", payment_status: "pending", transaction_ref: "TXN_DEMO_008", donated_at: new Date() },
    ]);
    console.log(`💰 Seeded ${donations.length} donations`);

    // ==========================================
    // 8. FEEDBACK (For resolved reports)
    // ==========================================
    const resolvedReports = reports.filter(r => r.status === "resolved");
    if (resolvedReports.length > 0) {
      const feedback = await Feedback.insertMany([
        { report_id: resolvedReports[0]._id, user_id: resolvedReports[0].user_id, rating: 5, message: "The rescue team was incredibly fast and handled the tortoise with care. Thank you!", submitted_at: new Date(resolvedReports[0].resolved_at.getTime() + 86400000) },
        { report_id: resolvedReports[1]._id, user_id: resolvedReports[1].user_id, rating: 4, message: "Good response, though it took a while to reach the location due to traffic. The monkey is safe now.", submitted_at: new Date(resolvedReports[1].resolved_at.getTime() + 86400000 * 2) },
        { report_id: resolvedReports[2]._id, user_id: resolvedReports[2].user_id, rating: 5, message: "Amazing work by the Assam team! Rescuing an elephant calf from the mud was heroic.", submitted_at: new Date(resolvedReports[2].resolved_at.getTime() + 86400000) },
      ]);
      console.log(`⭐ Seeded ${feedback.length} feedback entries`);
    }

    console.log("\n✅==========================================");
    console.log("✅ EXTENDED SEED DATA INSERTED SUCCESSFULLY");
    console.log("✅==========================================\n");

    console.log("--- Demo Accounts ---");
    console.log("👑 Admin:     admin@wildshield.com      / admin123");
    console.log("👨 Citizen 1: citizen1@wildshield.com   / citizen123");
    console.log("👩 Citizen 2: citizen2@wildshield.com   / citizen123");
    console.log("👨 Volunteer: volunteer1@wildshield.com / volunteer123");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error.stack || error);
    process.exit(1);
  }
};

seedAllExtended();
