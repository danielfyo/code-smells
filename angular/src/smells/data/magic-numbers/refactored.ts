// REFACTOR: Replace Magic Literal with Named Constant (and a union type for the strings).
export type VehicleKind = 'combustion' | 'electric';

export const FREE_MINUTES = 15;
export const MINUTES_PER_BILLED_HOUR = 60;
export const HOURLY_RATE_EUR = 2.5;
export const DAILY_CAP_EUR = 18;
export const ELECTRIC_DISCOUNT_FACTOR = 0.5;

export function parkingFee(minutes: number, vehicle: VehicleKind): number {
  if (minutes <= FREE_MINUTES) {
    return 0;
  }
  const billedHours = Math.ceil((minutes - FREE_MINUTES) / MINUTES_PER_BILLED_HOUR);
  const fee = Math.min(billedHours * HOURLY_RATE_EUR, DAILY_CAP_EUR);
  return vehicle === 'electric' ? fee * ELECTRIC_DISCOUNT_FACTOR : fee;
}
