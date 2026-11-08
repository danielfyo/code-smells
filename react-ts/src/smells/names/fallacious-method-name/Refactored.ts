export interface Coupon {
  code: string;
  usesLeft: number;
  expiresAt: Date;
}

// REFACTOR: the predicate is pure and its name tells the truth.
export function isRedeemable(coupon: Coupon, now: Date): boolean {
  return coupon.usesLeft > 0 && coupon.expiresAt > now;
}

// REFACTOR: the side effect gets its own command with an honest name.
export function redeem(coupon: Coupon, now: Date): boolean {
  if (!isRedeemable(coupon, now)) return false;
  coupon.usesLeft -= 1;
  return true;
}

// REFACTOR: the name reflects the unit returned.
export function getDiscountRate(code: string): number {
  return code.startsWith("VIP") ? 0.15 : 0.05;
}
