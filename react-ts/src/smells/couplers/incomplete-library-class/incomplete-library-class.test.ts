import * as Smelly from "./Smelly";
import * as Refactored from "./Refactored";

const friday = new Date("2026-05-01T00:00:00Z");

describe("Incomplete Library Class", () => {
  it("the computed dates match", () => {
    for (const days of [1, 3, 7]) {
      expect(Refactored.estimatedDelivery(friday, days)).toBe(Smelly.estimatedDelivery(friday, days));
    }
    expect(Refactored.paymentDeadline(friday)).toBe(Smelly.paymentDeadline(friday));
  });

  it("the local extension is tested once and serves everyone", () => {
    expect(Refactored.estimatedDelivery(friday, 1)).toBe("04/05/2026");
    expect(Refactored.paymentDeadline(friday)).toBe("15/05/2026");
    expect(Refactored.businessDate.isWeekend(new Date("2026-05-02T00:00:00Z"))).toBe(true);
  });
});
