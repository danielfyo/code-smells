export type Plan = "monthly" | "yearly";

const PRICES: Record<Plan, number> = { monthly: 9.99, yearly: 99 };

// REFACTOR: Move Function + Encapsulate Record + Remove Setting Method.
// Behaviour moves next to the data it uses and the setters disappear: state
// only changes through operations that carry business meaning.
export class Subscription {
  private cancelled = false;

  constructor(
    readonly plan: Plan,
    private renewsOn: Date,
  ) {}

  get renewalDate(): Date {
    return new Date(this.renewsOn);
  }

  get price(): number {
    return PRICES[this.plan];
  }

  isActive(today: Date): boolean {
    return !this.cancelled && this.renewsOn.getTime() >= today.getTime();
  }

  renew(): void {
    if (this.cancelled) throw new Error("Subscription cancelled");
    const next = new Date(this.renewsOn);
    if (this.plan === "monthly") next.setUTCMonth(next.getUTCMonth() + 1);
    else next.setUTCFullYear(next.getUTCFullYear() + 1);
    this.renewsOn = next;
  }

  cancel(): void {
    this.cancelled = true;
  }
}
