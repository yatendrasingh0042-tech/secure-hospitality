const mongoose = require("mongoose");

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB connection error:", err.message);
});

mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ MongoDB connection disconnected.");
});

mongoose.connection.on("reconnected", () => {
  console.log("✅ MongoDB connection reconnected.");
});

// Disable command buffering so disconnected queries fail immediately instead of hanging 10 seconds
mongoose.set("bufferCommands", false);

const connectDB = async () => {
  const isProduction = process.env.NODE_ENV === "production";
  const atlasUri = process.env.MONGODB_URI;
  const useLocalDb = process.env.USE_LOCAL_DB === "true";
  const localUri = process.env.LOCAL_MONGODB_URI || "mongodb://127.0.0.1:27017/secure_hospitality";

  const connectionOptions = {
    maxPoolSize: 20,
    minPoolSize: 2,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  };

  if (atlasUri && !useLocalDb) {
    try {
      await mongoose.connect(atlasUri, connectionOptions);
      console.log(`✅ Connected to MongoDB Atlas cluster [${isProduction ? "PRODUCTION" : "DEVELOPMENT"}]`);
      console.log(`📦 Database: ${mongoose.connection.name}`);
      return;
    } catch (err) {
      console.error("❌ Failed to connect to MongoDB Atlas cluster:", err.message);
      if (isProduction) {
        process.exit(1);
      }
      console.warn("⚠️ Attempting fallback to local MongoDB instance...");
    }
  }

  // Attempt local database connection fallback
  try {
    await mongoose.connect(localUri, { ...connectionOptions, serverSelectionTimeoutMS: 2000 });
    console.log("✅ Connected to Local MongoDB Database");
    console.log(`📦 Database: ${mongoose.connection.name}`);
  } catch (localErr) {
    console.warn(`⚠️ Notice: Database connection unavailable (${localErr.message}). API running in degraded/offline mode.`);
  }
};

module.exports = connectDB;