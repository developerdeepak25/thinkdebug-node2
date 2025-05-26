// server/config/dbConfig.js

import mongoose from "mongoose";

// const URI = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/test3');
    // await mongoose.connect("mongodb://localhost:27017/chatApp_hive");

    console.log("MongoDB Connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1); // Exit the process with a failure code
  }
};

export default connectDB;
