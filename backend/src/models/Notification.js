const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },
    type: {
      type: String,
      enum: {
        values: ["appointment", "medicine_order", "ambulance", "medical", "security", "system"],
        message: "{VALUE} is not a valid notification type",
      },
      required: [true, "Notification type is required"],
      index: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
    },
    channel: {
      type: String,
      enum: {
        values: ["in_app", "email", "sms", "push"],
        message: "{VALUE} is not a valid channel",
      },
      default: "in_app",
      index: true,
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "sent", "delivered", "failed", "read"],
        message: "{VALUE} is not a valid status",
      },
      default: "pending",
      index: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    readAt: {
      type: Date,
      default: null,
    },
    sentAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for fast unread queries per user
notificationSchema.index({ userId: 1, status: 1, createdAt: -1 });

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
