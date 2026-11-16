/**
 * Environment Variable Validation
 * Ensures required environment variables are set before server boots up.
 */

const validateEnv = () => {
  const requiredEnvVars = ["JWT_SECRET", "PORT"];
  const missingVars = [];

  requiredEnvVars.forEach((key) => {
    if (!process.env[key]) {
      missingVars.push(key);
    }
  });

  if (missingVars.length > 0) {
    console.error(`❌ CRITICAL SECURITY ERROR: Missing required environment variables: ${missingVars.join(", ")}`);
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    } else {
      console.warn("⚠️ Running with fallback defaults in development mode.");
    }
  } else {
    console.log("🔒 Environment configuration validated successfully.");
  }
};

module.exports = validateEnv;
