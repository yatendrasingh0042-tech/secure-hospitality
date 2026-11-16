const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const emergencyContactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Contact name is required"],
      maxlength: [100, "Contact name cannot exceed 100 characters"],
    },
    relationship: {
      type: String,
      trim: true,
      required: [true, "Relationship is required"],
      maxlength: [50, "Relationship cannot exceed 50 characters"],
    },
    phone: {
      type: String,
      trim: true,
      required: [true, "Phone number is required"],
      match: [/^[0-9+\-\s()]{7,20}$/, "Please provide a valid emergency phone number"],
    },
  },
  { timestamps: true }
);

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      maxlength: [50, "First name cannot exceed 50 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
    phone: {
      type: String,
      trim: true,
      match: [/^[0-9+\-\s()]{7,20}$/, "Please provide a valid phone number"],
    },
    passwordHash: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },
    role: {
      type: String,
      enum: {
        values: ["user", "admin", "patient", "doctor", "hospital_admin", "super_admin"],
        message: "{VALUE} is not a valid role",
      },
      default: "patient",
      required: [true, "Role is required"],
      lowercase: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String,
      trim: true,
      default: "",
    },
    dateOfBirth: {
      type: Date,
      default: null,
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other", "prefer_not_to_say", "Male", "Female", "Other", "Prefer not to say"],
        message: "{VALUE} is not a valid gender option",
      },
      default: "prefer_not_to_say",
    },
    address: {
      type: String,
      trim: true,
      maxlength: [255, "Address cannot exceed 255 characters"],
      default: "",
    },
    city: {
      type: String,
      trim: true,
      maxlength: [100, "City cannot exceed 100 characters"],
      default: "",
    },
    state: {
      type: String,
      trim: true,
      maxlength: [100, "State cannot exceed 100 characters"],
      default: "",
    },
    country: {
      type: String,
      trim: true,
      maxlength: [100, "Country cannot exceed 100 characters"],
      default: "",
    },
    emergencyContacts: [emergencyContactSchema],
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to hash password if modified
userSchema.pre("save", async function () {
  if (!this.isModified("passwordHash")) return;

  // Prevent re-hashing if passwordHash is already a bcrypt hash
  if (typeof this.passwordHash === "string" && !this.passwordHash.startsWith("$2")) {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  }
});

// Instance method to compare passwords safely
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.passwordHash) {
    throw new Error("Password hash not loaded in user query");
  }
  return await bcrypt.compare(candidatePassword, this.passwordHash);
};

// Safe JSON representation (excluding passwordHash and __v)
userSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.passwordHash;
    delete ret.__v;
    return ret;
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
