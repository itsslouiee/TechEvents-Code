const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME,
    });

    console.log("Database connected");
  } catch (err) {
    console.error("Database connection error:", err);
    process.exit(1); // Stop the server if DB connection fails
  }
};

module.exports = connectDB;
