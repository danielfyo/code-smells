import { applyCoupon } from "./production";

const coupon = { code: "SPRING", percent: 15, minOrder: 50 };

// REFACTOR: ignored tests are re-enabled (or deleted if no longer relevant). If one must
// stay pending, use it.todo with a reason and a ticket, never a silent skip.
describe("applyCoupon (refactored)", () => {
  it("applies the discount percentage", () => {
    expect(applyCoupon(100, coupon)).toBe(85);
  });

  it("does not apply the coupon below the minimum order", () => {
    expect(applyCoupon(40, coupon)).toBe(40);
  });

  it("rounds to cents", () => {
    expect(applyCoupon(99.99, coupon)).toBe(84.99);
  });
});
