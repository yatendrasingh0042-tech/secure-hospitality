const Notification = require("../models/Notification");
const { buildQueryResult } = require("../utils/queryHelper");

/**
 * @route   GET /api/notifications
 * @desc    Get user's notifications (Paginated, optional unread filter)
 * @access  Private
 */
const getUserNotifications = async (req, res) => {
  try {
    const filter = { userId: req.user._id };

    if (req.query.unread === "true") {
      filter.status = { $ne: "read" };
    } else if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.type) {
      filter.type = req.query.type;
    }

    if (req.query.channel) {
      filter.channel = req.query.channel;
    }

    const searchFields = ["title", "message"];

    const result = await buildQueryResult(
      Notification,
      filter,
      req.query,
      searchFields,
      []
    );

    // Calculate total unread count for user badge
    const unreadCount = await Notification.countDocuments({
      userId: req.user._id,
      status: { $ne: "read" },
    });

    return res.status(200).json({
      success: true,
      unreadCount,
      ...result,
    });
  } catch (error) {
    console.error("getUserNotifications error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications.",
    });
  }
};

/**
 * @route   PATCH /api/notifications/:id/read
 * @desc    Mark a single notification as read
 * @access  Private
 */
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });
    }

    notification.status = "read";
    notification.readAt = new Date();
    await notification.save();

    return res.status(200).json({
      success: true,
      message: "Notification marked as read.",
      data: notification,
    });
  } catch (error) {
    console.error("markAsRead error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to mark notification as read.",
    });
  }
};

/**
 * @route   PATCH /api/notifications/read-all
 * @desc    Mark all user's unread notifications as read
 * @access  Private
 */
const markAllAsRead = async (req, res) => {
  try {
    const result = await Notification.updateMany(
      {
        userId: req.user._id,
        status: { $ne: "read" },
      },
      {
        $set: {
          status: "read",
          readAt: new Date(),
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read.",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("markAllAsRead error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to mark all notifications as read.",
    });
  }
};

module.exports = {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
};
