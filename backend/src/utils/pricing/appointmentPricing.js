/**
 * Calculates differentiated doctor consultation fee server-side.
 */
function getAppointmentPrice(doctor, type = "in_person") {
  if (!doctor) return 500;
  const base = doctor.consultationFee || 500;
  const fees = doctor.consultationFees || {};

  if (type === "in_person") {
    return fees.inPerson !== undefined ? fees.inPerson : base;
  }
  if (type === "video" || type === "video_call") {
    if (fees.videoCall !== undefined) return fees.videoCall;
    return Math.max(100, Math.round((base * 0.75) / 50) * 50);
  }
  if (type === "follow_up") {
    if (fees.followUp !== undefined) return fees.followUp;
    return Math.max(100, Math.round((base * 0.5) / 50) * 50);
  }
  return base;
}

module.exports = {
  getAppointmentPrice,
};
