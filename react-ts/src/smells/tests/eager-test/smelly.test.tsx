import { ShoppingCart } from "./production";

// SMELL: eager test. A single test checks adding, accumulating, removing, computing the
// total and applying discounts. If it fails, the name doesn't say which behavior broke,
// and an early failure hides the outcome of every later check.
describe("ShoppingCart (smelly)", () => {
  it("the cart works", () => {
    const cart = new ShoppingCart();
    cart.add({ sku: "book", price: 20, quantity: 1 });
    cart.add({ sku: "book", price: 20, quantity: 2 });
    expect(cart.quantityOf("book")).toBe(3);
    cart.add({ sku: "pen", price: 1.5, quantity: 4 });
    expect(cart.total()).toBe(66);
    expect(cart.total(10)).toBe(59.4);
    cart.remove("book");
    expect(cart.quantityOf("book")).toBe(0);
    expect(cart.total()).toBe(6);
  });
});
