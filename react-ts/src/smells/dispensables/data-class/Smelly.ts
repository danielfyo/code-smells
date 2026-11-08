export type Plan = "monthly" | "yearly";

// SMELL: Data Class. `Subscription` only has fields and getters/setters; it
// cannot do anything. All the logic that understands it lives elsewhere, in a
// service, and anyone can leave it in an inconsistent state through the setters.
export class Subscription {
  private plan: Plan;
  private renewsOn: Date;
  private cancelled = false;

  constructor(plan: Plan, renewsOn: Date) {
    this.plan = plan;
    this.renewsOn = renewsOn;
  }

  getPlan(): Plan {
    return this.plan;
  }
  setPlan(plan: Plan): void {
    this.plan = plan;
  }
  getRenewsOn(): Date {
    return this.renewsOn;
  }
  setRenewsOn(date: Date): void {
    this.renewsOn = date;
  }
  isCancelled(): boolean {
    return this.cancelled;
  }
  setCancelled(value: boolean): void {
    this.cancelled = value;
  }
}

// SMELL: the domain logic envies the data of the class above.
export class SubscriptionService {
  isActive(sub: Subscription, today: Date): boolean {
    return !sub.isCancelled() && sub.getRenewsOn().getTime() >= today.getTime();
  }

  renew(sub: Subscription): void {
    if (sub.isCancelled()) throw new Error("Subscription cancelled");
    const next = new Date(sub.getRenewsOn());
    if (sub.getPlan() === "monthly") next.setUTCMonth(next.getUTCMonth() + 1);
    else next.setUTCFullYear(next.getUTCFullYear() + 1);
    sub.setRenewsOn(next);
  }

  price(sub: Subscription): number {
    return sub.getPlan() === "monthly" ? 9.99 : 99;
  }
}
