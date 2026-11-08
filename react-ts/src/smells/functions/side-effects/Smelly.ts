// SMELL: Side Effects. `isCouponValid` promises to only check, but it also marks
// the coupon as used and bumps a global statistic. Calling it twice (e.g. to
// render a banner and then at checkout) changes the result.
export const couponStats = { redeemed: 0 };

export class CouponBook {
  private used = new Set<string>();

  constructor(private readonly valid: ReadonlySet<string>) {}

  isCouponValid(code: string): boolean {
    const normalized = code.trim().toUpperCase();
    if (!this.valid.has(normalized) || this.used.has(normalized)) return false;
    // SMELL: hidden effect inside a "question".
    this.used.add(normalized);
    couponStats.redeemed++;
    return true;
  }
}
