import { CouponBook as SmellyBook, couponStats } from "./Smelly";
import { CouponBook as RefactoredBook } from "./Refactored";

const codes = new Set(["SPRING10"]);

describe("Side Effects", () => {
  it("bug: in the smelly version, checking twice invalidates the coupon", () => {
    couponStats.redeemed = 0;
    const book = new SmellyBook(codes);
    const showBanner = book.isCouponValid("spring10"); // we only wanted to know whether to show a banner
    const atCheckout = book.isCouponValid("spring10");
    expect([showBanner, atCheckout]).toEqual([true, false]);
    expect(couponStats.redeemed).toBe(1); // and it also touched a global counter
  });

  it("in the refactored version querying has no effects", () => {
    const book = new RefactoredBook(codes);
    expect(book.isValid("spring10")).toBe(true);
    expect(book.isValid("spring10")).toBe(true);
    book.redeem("spring10");
    expect(book.isValid("spring10")).toBe(false);
    expect(book.redeemed).toBe(1);
    expect(() => book.redeem("spring10")).toThrow("Invalid coupon");
  });
});
