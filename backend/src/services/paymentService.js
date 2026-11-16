/**
 * Payment Abstraction Service
 * Encapsulates payment processing logic suitable for future gateway integrations (Stripe/Razorpay)
 */
class PaymentService {
  /**
   * Process payment for an order
   * @param {Object} params
   * @param {string} params.orderId - Internal order ID
   * @param {number} params.amount - Total amount to charge
   * @param {string} [params.paymentMethod='mock_card'] - Payment method type
   * @returns {Promise<Object>} Payment receipt transaction details
   */
  async processPayment({ orderId, amount, paymentMethod = "mock_card" }) {
    // Simulated gateway processing delay
    await new Promise((resolve) => setTimeout(resolve, 50));

    const transactionId = `TXN_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

    return {
      success: true,
      transactionId,
      status: "paid",
      amount,
      paymentMethod,
      gatewayResponse: {
        code: "PAYMENT_SUCCESS",
        message: "Payment processed successfully via payment abstraction",
        processedAt: new Date().toISOString(),
      },
    };
  }

  /**
   * Process refund for a transaction
   * @param {string} transactionId
   * @param {number} amount
   * @returns {Promise<Object>} Refund receipt
   */
  async refundPayment(transactionId, amount) {
    await new Promise((resolve) => setTimeout(resolve, 50));

    const refundId = `REF_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

    return {
      success: true,
      refundId,
      status: "refunded",
      amount,
      refundedAt: new Date().toISOString(),
    };
  }
}

module.exports = new PaymentService();
