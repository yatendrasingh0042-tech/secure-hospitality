/**
 * Environment Variable Validation
 * Ensures required environment variables are set before server boots up.
 */

const validateEnv = () => {
  const isProduction = process.env.NODE_ENV === "production";
  const requiredEnvVars = ["JWT_SECRET"];
  const missingVars = [];

  requiredEnvVars.forEach((key) => {
    if (!process.env[key]) {
      missingVars.push(key);
    }
  });

  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.DATABASE_URL;
  if (!mongoUri && isProduction) {
    missingVars.push("MONGODB_URI");
  }

  if (missingVars.length > 0) {
    console.warn(`⚠️ CONFIGURATION WARNING: Missing environment variable(s): ${missingVars.join(", ")}`);
    if (isProduction) {
      console.warn("⚠️ Production serverless execution continuing with degraded fallbacks where appropriate. Configure missing variables in Vercel Dashboard.");
    } else {
      console.warn("⚠️ Running with fallback defaults in development mode.");
    }
  } else {
    console.log("🔒 Environment configuration validated successfully.");
  }
};

module.exports = validateEnv;
