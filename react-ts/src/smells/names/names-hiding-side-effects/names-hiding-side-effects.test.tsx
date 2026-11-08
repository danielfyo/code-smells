import * as smelly from "./Smelly";
import * as refactored from "./Refactored";

describe("names-hiding-side-effects", () => {
  beforeEach(() => {
    smelly.resetCarts();
    refactored.resetCarts();
  });

  it("smelly: a simple 'get' creates carts without the name warning you", () => {
    smelly.getCart("anna");
    smelly.getCart("luke");
    expect(smelly.cartCount()).toBe(2);
  });

  it("refactored: querying creates nothing; creating is explicit", () => {
    expect(refactored.findCart("anna")).toBeUndefined();
    expect(refactored.cartCount()).toBe(0);
    const cart = refactored.getOrCreateCart("anna");
    expect(cart).toEqual(smelly.getCart("anna"));
    expect(refactored.findCart("anna")).toBe(cart);
    expect(refactored.cartCount()).toBe(1);
  });
});
