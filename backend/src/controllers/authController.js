const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Generate JWT token helper
 * @param {string} userId
 * @param {string} role
 * @returns {string} JWT Token
 */
const generateToken = (userId, role) => {
  const secret = process.env.JWT_SECRET || "fallback_secret_key";
  const expiresIn = process.env.JWT_EXPIRES_IN || "1d";
  return jwt.sign({ id: userId, role }, secret, { expiresIn });
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user (Public registration defaults to patient)
 * @access  Public
 */
const register = async (req, res) => {
  try {
    if (!req.body || typeof req.body !== "object") {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields: firstName, lastName, email, password.",
      });
    }

    const { firstName, lastName, email, phone, password } = req.body;

    // 1. Basic field validation
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      typeof firstName !== "string" ||
      typeof lastName !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields: firstName, lastName, email, password.",
      });
    }

    // Password policy: At least 8 chars, uppercase, lowercase, digit, and special character
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long.",
      });
    }

    const passwordComplexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!passwordComplexityRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
      });
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    // Database connectivity guard
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: "Database temporarily unavailable.",
      });
    }

    // 2. Duplicate user check
    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "An account with this email address already exists.",
      });
    }

    // 3. Force public registration role to 'patient' to prevent privilege escalation
    const enforcedRole = "patient";

    // 4. Create new user
    const user = new User({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: normalizedEmail,
      phone: typeof phone === "string" ? phone.trim() : "",
      passwordHash: password, // Hashing happens via pre-save hook in User model
      role: enforcedRole,
    });

    await user.save();

    // 5. Generate token & response
    const token = generateToken(user._id, user.role);

    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
      token,
      user,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "An account with this email address already exists.",
      });
    }
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: messages.join(". "),
      });
    }
    console.error("Register Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error occurred during registration.",
    });
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
const login = async (req, res) => {
  try {
    if (!req.body || typeof req.body !== "object") {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const { email, password } = req.body;

    if (!email || !password || typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    // Database connectivity guard
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: "Database temporarily unavailable.",
      });
    }

    // Must select passwordHash explicitly as it is select: false by default
    const user = await User.findOne({ email: normalizedEmail }).select("+passwordHash");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account has been deactivated. Please contact support.",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Update lastLogin timestamp
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    // Generate token & safe JSON user
    const token = generateToken(user._id, user.role);

    return res.status(200).json({
      success: true,
      message: "Logged in successfully.",
      token,
      user,
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error occurred during login.",
    });
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get currently logged in user profile
 * @access  Private (Protected by requireAuth)
 */
const getMe = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    console.error("getMe Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error occurred fetching profile.",
    });
  }
};

/**
 * @route   PUT /api/auth/me
 * @desc    Update currently logged in user profile
 * @access  Private (Protected by requireAuth)
 */
const updateMe = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const {
      firstName,
      lastName,
      phone,
      dateOfBirth,
      gender,
      address,
      city,
      state,
      country,
      avatar,
      emergencyContacts,
      preferences,
    } = req.body;

    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (phone !== undefined) user.phone = phone;
    if (dateOfBirth !== undefined) user.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : null;
    if (gender !== undefined) {
      const gStr = typeof gender === "string" ? gender.trim().toLowerCase() : "";
      if (gStr === "male") user.gender = "male";
      else if (gStr === "female") user.gender = "female";
      else if (gStr === "other") user.gender = "other";
      else user.gender = "prefer_not_to_say";
    }
    if (address !== undefined) user.address = address;
    if (city !== undefined) user.city = city;
    if (state !== undefined) user.state = state;
    if (country !== undefined) user.country = country;
    if (avatar !== undefined) user.avatar = avatar;

    if (emergencyContacts !== undefined && Array.isArray(emergencyContacts)) {
      user.emergencyContacts = emergencyContacts.map((c) => ({
        name: c.name || "",
        relationship: c.relationship || c.relation || "",
        phone: c.phone || "",
        ...(c._id || c.id ? { _id: c._id || c.id } : {}),
      }));
    }

    if (preferences !== undefined) {
      user.preferences = { ...user.preferences, ...preferences };
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user,
    });
  } catch (error) {
    console.error("updateMe Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error occurred updating profile.",
    });
  }
};

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (Stateless token invalidation notification)
 * @access  Public / Private
 */
const logout = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Logged out successfully. Please remove authentication token from client storage.",
  });
};

module.exports = {
  register,
  login,
  getMe,
  updateMe,
  logout,
};

