/**
 * Centralized Global Error Handler Middleware
 * Formats all backend errors into a consistent standard JSON response schema.
 */

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors = null;

  // 1. Mongoose Bad ObjectId (CastError)
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid resource ID format: ${err.value}`;
  }

  // 2. Mongoose Validation Error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Input validation failed";
    errors = Object.values(err.errors).map((val) => val.message);
  }

  // 3. Mongoose Duplicate Key Error (11000)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0] || "field";
    message = `Duplicate field value entered for '${field}'. Please use another value.`;
  }

  // 4. JWT Authentication Errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token provided. Access denied.";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token has expired. Please log in again.";
  }

  // 5. Database Connection / Buffering Timeout Errors
  if (
    err.name === "MongooseError" ||
    err.name === "MongoServerSelectionError" ||
    err.name === "MongoNetworkError" ||
    (err.message && err.message.includes("buffering timed out"))
  ) {
    statusCode = 503;
    message = "Database temporarily unavailable.";
  }

  // Production vs Development stack trace masking
  const responsePayload = {
    success: false,
    message,
    ...(errors && { errors }),
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  };

  if (statusCode >= 500) {
    console.error(`❌ Global Server Error [${req.method} ${req.url}]:`, err);
  }

  res.status(statusCode).json(responsePayload);
};

module.exports = errorHandler;
