export interface Coupon {
  code: string;
  usesLeft: number;
  expiresAt: Date;
}

// SMELL: fallacious name. "isValid" promises a pure question, but it also CONSUMES one
// use of the coupon. Calling it twice to show a message burns two uses.
export function isValid(coupon: Coupon, now: Date): boolean {
  if (coupon.usesLeft <= 0 || coupon.expiresAt <= now) return false;
  coupon.usesLeft -= 1;
  return true;
}

// SMELL: "getDiscountPercent" actually returns a fraction (0.15), not a percentage.
export function getDiscountPercent(code: string): number {
  return code.startsWith("VIP") ? 0.15 : 0.05;
}
