const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
} = require("../controllers/orderController");
const { requireAuth, requireRole } = require("../middleware/auth");

router.use(requireAuth);

router.post("/", createOrder);
router.get("/", getOrders);
router.get("/:id", getOrderById);
router.patch("/:id/status", requireRole("super_admin", "hospital_admin"), updateOrderStatus);

module.exports = router;
