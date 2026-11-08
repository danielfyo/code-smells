import { Cart as SmellyCart } from "./Smelly";
import { Cart as RefactoredCart } from "./Refactored";

describe("redundant-comment", () => {
  it.each([
    ["smelly", SmellyCart],
    ["refactored", RefactoredCart],
  ])("%s computes total and number of lines", (_name, CartClass) => {
    const cart = new CartClass();
    cart.add({ sku: "A", price: 2, quantity: 3 });
    cart.add({ sku: "B", price: 5, quantity: 1 });
    expect(cart.total()).toBe(11);
    expect(cart.count()).toBe(2);
  });
});
