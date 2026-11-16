const mongoose = require("mongoose");

/**
 * Middleware to verify MongoDB database connectivity.
 * Immediately returns HTTP 503 (Service Unavailable) if the database is disconnected,
 * preventing Mongoose query buffering timeouts (10000ms) and misleading 500 errors.
 */
const checkDbConnection = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: "Database temporarily unavailable.",
    });
  }
  next();
};

module.exports = checkDbConnection;
