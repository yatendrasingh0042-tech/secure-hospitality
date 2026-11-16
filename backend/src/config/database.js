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

// Global cached connection for serverless execution environments (Vercel)
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const sanitizeMongoUri = (uri) => {
  if (!uri) return "NONE";
  try {
    return uri.replace(/:([^@/]+)@/, ":****@");
  } catch {
    return "CONFIGURED";
  }
};

const connectDB = async () => {
  // If already connected, return immediately
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (cached.conn) {
    return cached.conn;
  }

  const isProduction = process.env.NODE_ENV === "production";
  const atlasUri = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.DATABASE_URL;
  const useLocalDb = process.env.USE_LOCAL_DB === "true";
  const localUri = process.env.LOCAL_MONGODB_URI || "mongodb://127.0.0.1:27017/secure_hospitality";

  const connectionOptions = {
    maxPoolSize: isProduction ? 10 : 20,
    minPoolSize: isProduction ? 0 : 2,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  };

  // 1. Production or Atlas configured connection
  if (atlasUri && !useLocalDb) {
    if (!cached.promise) {
      cached.promise = mongoose
        .connect(atlasUri, connectionOptions)
        .then((mongooseInstance) => {
          console.log(`✅ Connected to MongoDB Atlas cluster [${isProduction ? "PRODUCTION" : "DEVELOPMENT"}]`);
          console.log(`📦 Database: ${mongoose.connection.name}`);
          return mongooseInstance.connection;
        })
        .catch((err) => {
          cached.promise = null;
          console.error("❌ Failed to connect to MongoDB Atlas cluster:", err.message);
          if (isProduction) {
            throw err;
          }
          return null;
        });
    }

    try {
      cached.conn = await cached.promise;
      if (cached.conn) return cached.conn;
    } catch (err) {
      if (isProduction) {
        throw err;
      }
      console.warn("⚠️ Attempting fallback to local MongoDB instance for development...");
    }
  }

  // 2. Local development fallback (strictly non-production)
  if (!isProduction) {
    try {
      await mongoose.connect(localUri, { ...connectionOptions, serverSelectionTimeoutMS: 2000 });
      console.log("✅ Connected to Local MongoDB Database");
      console.log(`📦 Database: ${mongoose.connection.name}`);
      return mongoose.connection;
    } catch (localErr) {
      console.warn(`⚠️ Notice: Local database connection unavailable (${localErr.message}). API running in degraded/offline mode.`);
    }
  } else if (!atlasUri) {
    console.error("❌ CRITICAL ERROR: MONGODB_URI environment variable is not defined in production environment.");
  }

  return mongoose.connection;
};

module.exports = connectDB;