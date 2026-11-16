export const FREE_DELIVERY_THRESHOLD = 500;
export const STANDARD_DELIVERY_FEE = 49;
export const EXPRESS_DELIVERY_FEE = 49;

export type DeliveryMethod = "standard" | "express";

/**
 * Calculates delivery charge based on cart subtotal and delivery method.
 * Rules:
 * - Cart Subtotal >= ₹500: Standard is FREE (₹0), Express is ₹49.
 * - Cart Subtotal < ₹500: Standard is ₹49, Express is ₹49.
 */
export function calculateDeliveryCharge(
  cartSubtotal: number,
  deliveryMethod: DeliveryMethod = "standard"
): number {
  if (cartSubtotal <= 0) return 0;
  if (cartSubtotal >= FREE_DELIVERY_THRESHOLD) {
    return deliveryMethod === "express" ? EXPRESS_DELIVERY_FEE : 0;
  }
  return deliveryMethod === "express" ? EXPRESS_DELIVERY_FEE : STANDARD_DELIVERY_FEE;
}
