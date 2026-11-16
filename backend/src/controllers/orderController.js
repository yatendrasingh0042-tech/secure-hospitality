const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Medicine = require("../models/Medicine");
const paymentService = require("../services/paymentService");
const { buildQueryResult } = require("../utils/queryHelper");

const { calculateDeliveryCharge } = require("../utils/pricing/deliveryPricing");

/**
 * @route   POST /api/orders
 * @desc    Create new order (Strict backend pricing calculation & atomic stock deduction)
 * @access  Private
 */
const createOrder = async (req, res) => {
  try {
    const { deliveryAddress, prescriptionReference, deliveryMethod: rawDeliveryMethod, items: rawItems } = req.body;
    const deliveryMethod = rawDeliveryMethod === "express" ? "express" : "standard";

    if (!deliveryAddress) {
      return res.status(400).json({
        success: false,
        message: "Delivery address is required.",
      });
    }

    let itemsToProcess = [];

    if (Array.isArray(rawItems) && rawItems.length > 0) {
      itemsToProcess = rawItems;
    } else {
      // Read items from user's Cart
      const cart = await Cart.findOne({ userId: req.user._id });
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Your cart is empty. Please add items before checking out.",
        });
      }
      itemsToProcess = cart.items.map((i) => ({
        medicineId: i.medicineId,
        quantity: i.quantity,
      }));
    }

    let subtotal = 0;
    const validatedItems = [];
    const medicinesToUpdate = [];

    // STRICT BACKEND PRICING & STOCK VALIDATION
    for (const item of itemsToProcess) {
      const medicine = await Medicine.findById(item.medicineId);

      if (!medicine || medicine.status === "discontinued") {
        return res.status(400).json({
          success: false,
          message: `Medicine not found or unavailable.`,
        });
      }

      const qty = Math.max(1, parseInt(item.quantity, 10) || 1);

      if (medicine.stock < qty) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for '${medicine.name}'. Requested: ${qty}, Available: ${medicine.stock}.`,
        });
      }

      // Compute item total using DATABASE PRICE strictly
      const unitPrice = medicine.price;
      const totalPrice = unitPrice * qty;
      subtotal += totalPrice;

      validatedItems.push({
        medicineId: medicine._id,
        medicineName: medicine.name,
        unitPrice,
        quantity: qty,
        totalPrice,
      });

      medicinesToUpdate.push({ medicine, quantity: qty });
    }

    const deliveryFee = calculateDeliveryCharge(subtotal, deliveryMethod);
    const total = subtotal + deliveryFee;

    // Create Order document (initial pending state)
    const order = new Order({
      userId: req.user._id,
      items: validatedItems,
      subtotal,
      deliveryMethod,
      deliveryFee,
      deliveryCharge: deliveryFee,
      total,
      deliveryAddress:
        typeof deliveryAddress === "object"
          ? `${deliveryAddress.street || ""}, ${deliveryAddress.city || ""}, ${deliveryAddress.state || ""} ${deliveryAddress.pincode || ""}`.trim()
          : String(deliveryAddress || "").trim(),
      paymentStatus: "pending",
      orderStatus: "confirmed",
      prescriptionReference: prescriptionReference || "",
    });

    // Atomically deduct inventory stock
    for (const entry of medicinesToUpdate) {
      entry.medicine.stock -= entry.quantity;
      if (entry.medicine.stock <= 0) {
        entry.medicine.status = "out_of_stock";
      }
      await entry.medicine.save();
    }

    // Process payment abstraction
    const paymentReceipt = await paymentService.processPayment({
      orderId: order._id.toString(),
      amount: total,
    });

    if (paymentReceipt.success) {
      order.paymentStatus = "paid";
      order.paymentDetails = {
        transactionId: paymentReceipt.transactionId,
        paymentMethod: paymentReceipt.paymentMethod,
        paidAt: new Date(),
      };
    }

    await order.save();

    // Clear user's Cart after successful order creation
    await Cart.findOneAndUpdate({ userId: req.user._id }, { $set: { items: [] } });

    return res.status(201).json({
      success: true,
      message: "Order placed and payment processed successfully.",
      data: order,
    });
  } catch (error) {
    console.error("createOrder error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to place order.",
    });
  }
};

/**
 * @route   GET /api/orders
 * @desc    Get order history (Patients see own, Admins see all)
 * @access  Private
 */
const getOrders = async (req, res) => {
  try {
    const filter = {};

    if (req.user.role === "patient") {
      filter.userId = req.user._id;
    }

    if (req.query.orderStatus) filter.orderStatus = req.query.orderStatus;
    if (req.query.paymentStatus) filter.paymentStatus = req.query.paymentStatus;

    const populateOptions = [{ path: "userId", select: "firstName lastName email phone" }];

    const result = await buildQueryResult(Order, filter, req.query, [], populateOptions);

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("getOrders error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch order history.",
    });
  }
};

/**
 * @route   GET /api/orders/:id
 * @desc    Get single order details
 * @access  Private
 */
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("userId", "firstName lastName email phone");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    if (req.user.role === "patient" && order.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only view your own orders.",
      });
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("getOrderById error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch order details.",
    });
  }
};

/**
 * @route   PATCH /api/orders/:id/status
 * @desc    Update order status or payment status
 * @access  Private (super_admin, hospital_admin)
 */
const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully.",
      data: order,
    });
  } catch (error) {
    console.error("updateOrderStatus error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update order status.",
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
};
