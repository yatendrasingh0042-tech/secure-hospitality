import { Doctor } from "@/types/doctor";

export type AppointmentTypeKey = "in_person" | "video" | "video_call" | "follow_up";

/**
 * Calculates differentiated doctor consultation fee.
 * Default Business Rule:
 * - In-Person: Doctor Base Fee
 * - Video Call: Cheaper than In-Person (e.g. 75% or configured)
 * - Follow-Up: Cheapest option (e.g. 50% or configured)
 */
export function getAppointmentPrice(
  doctor: Partial<Doctor> | null | undefined,
  type: AppointmentTypeKey = "in_person"
): number {
  if (!doctor) return 500;
  const base = doctor.consultationFee || 500;
  const fees = doctor.consultationFees;

  if (type === "in_person") {
    return fees?.inPerson ?? base;
  }
  if (type === "video" || type === "video_call") {
    if (fees?.videoCall !== undefined) return fees.videoCall;
    return Math.max(100, Math.round((base * 0.75) / 50) * 50);
  }
  if (type === "follow_up") {
    if (fees?.followUp !== undefined) return fees.followUp;
    return Math.max(100, Math.round((base * 0.5) / 50) * 50);
  }
  return base;
}
