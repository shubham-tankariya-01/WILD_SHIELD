const mongoose = require("mongoose");
const dns = require("dns");

dns.setServers(['8.8.8.8', '8.8.4.4']); // force Node to use Google DNS for SRV lookup

const connectDB = async () => {
  try {
    console.log(process.env.MONGODB_URI);
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      family: 4 // Force IPv4
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
