const express = require("express");
const router = express.Router();
const { register, login, getMe, updateMe, logout } = require("../controllers/authController");
const { requireAuth } = require("../middleware/auth");

const { authLimiter } = require("../middleware/rateLimiter");

// Public routes
router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/logout", logout);

// Protected routes
router.get("/me", requireAuth, getMe);
router.put("/me", requireAuth, updateMe);

module.exports = router;

