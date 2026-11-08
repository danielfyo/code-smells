import { applyCoupon } from "./production";

const coupon = { code: "SPRING", percent: 15, minOrder: 50 };

describe("applyCoupon (smelly)", () => {
  it("applies the discount percentage", () => {
    expect(applyCoupon(100, coupon)).toBe(85);
  });

  // SMELL: ignored test with no explanation. Someone disabled it "temporarily" months
  // ago; nobody knows whether it fails, why, or whether the rule still applies.
  it.skip("does not apply the coupon below the minimum order", () => {
    expect(applyCoupon(40, coupon)).toBe(40);
  });

  // SMELL: another ignored one: rounding to cents goes unverified.
  it.skip("rounds to cents", () => {
    expect(applyCoupon(99.99, coupon)).toBe(84.99);
  });
});
