const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
require("dotenv").config({ path: path.resolve(process.cwd(), ".env") });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const seedAdmin = async () => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.error("❌ Error: ADMIN_EMAIL and ADMIN_PASSWORD must be defined in backend/.env");
    process.exit(1);
  }

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error("❌ Error: MONGODB_URI is not defined in backend/.env");
    process.exit(1);
  }

  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB.");

    const normalizedEmail = adminEmail.trim().toLowerCase();
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(adminPassword, salt);

    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      user = new User({
        firstName: "Admin",
        lastName: "System",
        email: normalizedEmail,
        passwordHash,
        role: "admin",
        isActive: true,
        isEmailVerified: true,
        onboardingCompleted: true,
      });
      await user.save();
      console.log(`✅ Admin account created successfully for [${normalizedEmail}] with role="admin".`);
    } else {
      user.role = "admin";
      user.passwordHash = passwordHash;
      user.isActive = true;
      await user.save();
      console.log(`✅ Existing user [${normalizedEmail}] updated successfully to role="admin".`);
    }

    await mongoose.connection.close();
    console.log("Database connection closed.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding admin user:", error.message);
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

seedAdmin();
