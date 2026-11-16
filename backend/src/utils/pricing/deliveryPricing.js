const FREE_DELIVERY_THRESHOLD = 500;
const STANDARD_DELIVERY_FEE = 49;
const EXPRESS_DELIVERY_FEE = 49;

/**
 * Calculates delivery charge server-side based on cart subtotal and delivery method.
 */
function calculateDeliveryCharge(cartSubtotal, deliveryMethod = "standard") {
  if (!cartSubtotal || cartSubtotal <= 0) return 0;
  if (cartSubtotal >= FREE_DELIVERY_THRESHOLD) {
    return deliveryMethod === "express" ? EXPRESS_DELIVERY_FEE : 0;
  }
  return deliveryMethod === "express" ? EXPRESS_DELIVERY_FEE : STANDARD_DELIVERY_FEE;
}

module.exports = {
  FREE_DELIVERY_THRESHOLD,
  STANDARD_DELIVERY_FEE,
  EXPRESS_DELIVERY_FEE,
  calculateDeliveryCharge,
};
