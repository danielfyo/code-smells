// REFACTOR: Separate Query from Modifier + remove the global state. The query
// (`isValid`) changes nothing; the state change is an explicit command
// (`redeem`) and the statistic belongs to the instance.
export class CouponBook {
  private readonly used = new Set<string>();
  private redeemedCount = 0;

  constructor(private readonly valid: ReadonlySet<string>) {}

  private static normalize(code: string): string {
    return code.trim().toUpperCase();
  }

  isValid(code: string): boolean {
    const normalized = CouponBook.normalize(code);
    return this.valid.has(normalized) && !this.used.has(normalized);
  }

  redeem(code: string): void {
    if (!this.isValid(code)) throw new Error(`Invalid coupon: ${code}`);
    this.used.add(CouponBook.normalize(code));
    this.redeemedCount++;
  }

  get redeemed(): number {
    return this.redeemedCount;
  }
}
