const express = require("express");
const router = express.Router();
const User = require("../models/User");

// @route   GET /api/users/test
// @desc    Test endpoint to verify User model loading
// @access  Public
router.get("/test", (req, res) => {
  try {
    const isLoaded = Boolean(User && User.modelName === "User");
    return res.status(200).json({
      success: true,
      message: "User model loaded successfully",
      modelName: User.modelName,
      isLoaded: isLoaded,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to load User model",
      error: error.message,
    });
  }
});

module.exports = router;
