import { getDiscountPercent, isValid } from "./Smelly";
import { getDiscountRate, isRedeemable, redeem } from "./Refactored";

const now = new Date("2024-01-01");
const future = new Date("2025-01-01");

describe("fallacious-method-name", () => {
  it("smelly: asking 'isValid' burns coupon uses", () => {
    const coupon = { code: "VIP10", usesLeft: 1, expiresAt: future };
    expect(isValid(coupon, now)).toBe(true);
    expect(isValid(coupon, now)).toBe(false); // the second "question" is no longer valid
  });

  it("refactored: asking changes nothing; redeeming does", () => {
    const coupon = { code: "VIP10", usesLeft: 1, expiresAt: future };
    expect(isRedeemable(coupon, now)).toBe(true);
    expect(isRedeemable(coupon, now)).toBe(true);
    expect(redeem(coupon, now)).toBe(true);
    expect(redeem(coupon, now)).toBe(false);
  });

  it("the returned discount is a fraction in both versions", () => {
    expect(getDiscountPercent("VIP1")).toBe(getDiscountRate("VIP1"));
    expect(getDiscountRate("BASIC")).toBe(0.05);
  });
});
