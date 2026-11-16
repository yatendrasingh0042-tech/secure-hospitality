const Cart = require("../models/Cart");
const Medicine = require("../models/Medicine");

/**
 * Helper to compute backend subtotal for cart items
 */
const calculateCartTotals = async (items) => {
  let subtotal = 0;
  const populatedItems = [];

  for (const item of items) {
    const medicine = await Medicine.findById(item.medicineId);
    if (medicine && medicine.status === "active") {
      const itemSubtotal = medicine.price * item.quantity;
      subtotal += itemSubtotal;
      populatedItems.push({
        medicine: {
          _id: medicine._id,
          name: medicine.name,
          price: medicine.price,
          stock: medicine.stock,
          prescriptionRequired: medicine.prescriptionRequired,
        },
        quantity: item.quantity,
        itemSubtotal,
      });
    }
  }

  const deliveryFee = populatedItems.length > 0 ? 50 : 0;
  const total = subtotal + deliveryFee;

  return {
    items: populatedItems,
    subtotal,
    deliveryFee,
    total,
  };
};

/**
 * @route   GET /api/cart
 * @desc    Get user cart with backend-computed totals
 * @access  Private
 */
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = new Cart({ userId: req.user._id, items: [] });
      await cart.save();
    }

    const cartSummary = await calculateCartTotals(cart.items);

    return res.status(200).json({
      success: true,
      data: {
        _id: cart._id,
        userId: cart.userId,
        ...cartSummary,
      },
    });
  } catch (error) {
    console.error("getCart error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch cart.",
    });
  }
};

/**
 * @route   POST /api/cart
 * @desc    Add or update medicine item quantity in cart
 * @access  Private
 */
const addToCart = async (req, res) => {
  try {
    const { medicineId, quantity } = req.body;
    const qty = Math.max(1, parseInt(quantity, 10) || 1);

    if (!medicineId) {
      return res.status(400).json({
        success: false,
        message: "medicineId is required.",
      });
    }

    const medicine = await Medicine.findById(medicineId);
    if (!medicine || medicine.status !== "active") {
      return res.status(404).json({
        success: false,
        message: "Medicine is not available.",
      });
    }

    if (medicine.stock < qty) {
      return res.status(400).json({
        success: false,
        message: `Only ${medicine.stock} units in stock.`,
      });
    }

    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = new Cart({ userId: req.user._id, items: [] });
    }

    const existingIndex = cart.items.findIndex(
      (item) => item.medicineId.toString() === medicineId
    );

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity = qty;
    } else {
      cart.items.push({ medicineId, quantity: qty });
    }

    await cart.save();
    const cartSummary = await calculateCartTotals(cart.items);

    return res.status(200).json({
      success: true,
      message: "Cart updated successfully.",
      data: {
        _id: cart._id,
        userId: cart.userId,
        ...cartSummary,
      },
    });
  } catch (error) {
    console.error("addToCart error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update cart.",
    });
  }
};

/**
 * @route   DELETE /api/cart/items/:medicineId
 * @desc    Remove an item from cart
 * @access  Private
 */
const removeFromCart = async (req, res) => {
  try {
    const { medicineId } = req.params;
    let cart = await Cart.findOne({ userId: req.user._id });

    if (cart) {
      cart.items = cart.items.filter((item) => item.medicineId.toString() !== medicineId);
      await cart.save();
    }

    const cartSummary = await calculateCartTotals(cart ? cart.items : []);

    return res.status(200).json({
      success: true,
      message: "Item removed from cart.",
      data: {
        _id: cart ? cart._id : null,
        userId: req.user._id,
        ...cartSummary,
      },
    });
  } catch (error) {
    console.error("removeFromCart error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to remove item from cart.",
    });
  }
};

/**
 * @route   DELETE /api/cart
 * @desc    Clear all items from cart
 * @access  Private
 */
const clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully.",
      data: {
        userId: req.user._id,
        items: [],
        subtotal: 0,
        deliveryFee: 0,
        total: 0,
      },
    });
  } catch (error) {
    console.error("clearCart error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to clear cart.",
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
};
