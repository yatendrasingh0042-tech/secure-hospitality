const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Middleware to verify JWT token and attach authenticated user to request
 */
const requireAuth = async (req, res, next) => {
  try {
    // Allow CORS preflight requests to pass through
    if (req.method === "OPTIONS") {
      return next();
    }

    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. No token provided.",
      });
    }

    const secret = process.env.JWT_SECRET || "fallback_secret_key";
    const decoded = jwt.verify(token, secret);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed. User no longer exists.",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account has been deactivated. Please contact support.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please log in again.",
      });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token.",
      });
    }
    return res.status(401).json({
      success: false,
      message: "Authentication failed.",
    });
  }
};

/**
 * Optional authentication middleware to attach user if token is present
 */
const optionalAuth = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (token) {
      const secret = process.env.JWT_SECRET || "fallback_secret_key";
      const decoded = jwt.verify(token, secret);
      const user = await User.findById(decoded.id);
      if (user && user.isActive) {
        req.user = user;
      }
    }
  } catch (error) {
    // Ignore invalid/expired tokens for optional auth
  }
  next();
};

/**
 * Middleware to enforce role-based access control (RBAC)
 * @param  {...string} roles Allowed roles
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Insufficient permissions.",
      });
    }

    next();
  };
};

const requireAdmin = requireRole("admin", "super_admin", "hospital_admin");

module.exports = {
  requireAuth,
  optionalAuth,
  requireRole,
  requireAdmin,
};
