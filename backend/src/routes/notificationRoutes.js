const express = require("express");
const router = express.Router();
const {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
} = require("../controllers/notificationController");
const { requireAuth } = require("../middleware/auth");

router.use(requireAuth);

router.get("/", getUserNotifications);
router.patch("/read-all", markAllAsRead);
router.patch("/:id/read", markAsRead);

module.exports = router;
