import { Subscription as SmellySub, SubscriptionService } from "./Smelly";
import { Subscription as RefactoredSub } from "./Refactored";

const start = () => new Date("2026-01-31T00:00:00Z");
const today = new Date("2026-02-15T00:00:00Z");

describe("Data Class", () => {
  it("renew, query and cancel behave the same", () => {
    const service = new SubscriptionService();
    const s = new SmellySub("yearly", start());
    const r = new RefactoredSub("yearly", start());

    service.renew(s);
    r.renew();
    expect(r.renewalDate.toISOString()).toBe(s.getRenewsOn().toISOString());
    expect(r.isActive(today)).toBe(service.isActive(s, today));
    expect(r.price).toBe(service.price(s));

    s.setCancelled(true);
    r.cancel();
    expect(r.isActive(today)).toBe(false);
    expect(service.isActive(s, today)).toBe(false);
    expect(() => r.renew()).toThrow("Subscription cancelled");
    expect(() => service.renew(s)).toThrow("Subscription cancelled");
  });

  it("the smelly class allows inconsistent state from the outside", () => {
    const s = new SmellySub("monthly", start());
    s.getRenewsOn().setUTCFullYear(1999); // the getter leaks the internal reference
    expect(s.getRenewsOn().getUTCFullYear()).toBe(1999);

    const r = new RefactoredSub("monthly", start());
    r.renewalDate.setUTCFullYear(1999); // defensive copy
    expect(r.renewalDate.getUTCFullYear()).toBe(2026);
  });
});
