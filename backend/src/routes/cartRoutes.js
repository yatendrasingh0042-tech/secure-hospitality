const express = require("express");
const router = express.Router();
const {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");
const { requireAuth } = require("../middleware/auth");

router.use(requireAuth);

router.get("/", getCart);
router.post("/", addToCart);
router.delete("/items/:medicineId", removeFromCart);
router.delete("/", clearCart);

module.exports = router;
