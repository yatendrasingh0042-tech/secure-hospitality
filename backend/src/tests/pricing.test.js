const { calculateDeliveryCharge } = require("../utils/pricing/deliveryPricing");
const { getAppointmentPrice } = require("../utils/pricing/appointmentPricing");

function runTests() {
  console.log("=========================================");
  console.log("RUNNING AUTOMATED PRICING UNIT TESTS...");
  console.log("=========================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ PASSED: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAILED: ${message}`);
      failed++;
    }
  }

  // 1. Delivery Pricing Matrix Tests
  console.log("--- 1. DELIVERY PRICING MATRIX TESTS ---");
  assert(calculateDeliveryCharge(499, "standard") === 49, "Subtotal 499 + Standard -> Fee 49");
  assert(calculateDeliveryCharge(499, "express") === 49, "Subtotal 499 + Express -> Fee 49");
  assert(calculateDeliveryCharge(500, "standard") === 0, "Subtotal 500 + Standard -> Fee 0 (FREE)");
  assert(calculateDeliveryCharge(500, "express") === 49, "Subtotal 500 + Express -> Fee 49");
  assert(calculateDeliveryCharge(1000, "standard") === 0, "Subtotal 1000 + Standard -> Fee 0 (FREE)");
  assert(calculateDeliveryCharge(1000, "express") === 49, "Subtotal 1000 + Express -> Fee 49");
  assert(calculateDeliveryCharge(0, "standard") === 0, "Subtotal 0 + Standard -> Fee 0");

  // 2. Doctor Differentiated Consultation Pricing Tests
  console.log("\n--- 2. DOCTOR CONSULTATION PRICING TESTS ---");
  const mockDoctor = {
    consultationFee: 800,
    consultationFees: {
      inPerson: 800,
      videoCall: 600,
      followUp: 400,
    },
  };

  assert(getAppointmentPrice(mockDoctor, "in_person") === 800, "Doctor in_person fee -> 800");
  assert(getAppointmentPrice(mockDoctor, "video") === 600, "Doctor video fee -> 600");
  assert(getAppointmentPrice(mockDoctor, "video_call") === 600, "Doctor video_call fee -> 600");
  assert(getAppointmentPrice(mockDoctor, "follow_up") === 400, "Doctor follow_up fee -> 400");

  // 3. Doctor Fallback Calculation Tests (for doctors with only base fee)
  console.log("\n--- 3. DOCTOR FALLBACK CALCULATION TESTS ---");
  const fallbackDoctor = { consultationFee: 1000 };
  assert(getAppointmentPrice(fallbackDoctor, "in_person") === 1000, "Fallback in_person fee -> 1000");
  assert(getAppointmentPrice(fallbackDoctor, "video") === 750, "Fallback video fee -> 750 (75%)");
  assert(getAppointmentPrice(fallbackDoctor, "follow_up") === 500, "Fallback follow_up fee -> 500 (50%)");

  console.log("\n=========================================");
  console.log(`TEST SUMMARY: ${passed} Passed, ${failed} Failed.`);
  console.log("=========================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
