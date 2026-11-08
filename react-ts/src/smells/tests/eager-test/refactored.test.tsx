import { ShoppingCart } from "./production";

// REFACTOR: one behavior per test, with a name that describes it.
// Each test sets up only what it needs and fails for a single reason.
describe("ShoppingCart (refactored)", () => {
  let cart: ShoppingCart;

  beforeEach(() => {
    cart = new ShoppingCart();
  });

  it("accumulates quantity when adding the same product", () => {
    cart.add({ sku: "book", price: 20, quantity: 1 });
    cart.add({ sku: "book", price: 20, quantity: 2 });
    expect(cart.quantityOf("book")).toBe(3);
  });

  it("computes the total as price times quantity", () => {
    cart.add({ sku: "book", price: 20, quantity: 3 });
    cart.add({ sku: "pen", price: 1.5, quantity: 4 });
    expect(cart.total()).toBe(66);
  });

  it("applies a percentage discount to the total", () => {
    cart.add({ sku: "book", price: 20, quantity: 3 });
    expect(cart.total(10)).toBe(54);
  });

  it("removes the product completely", () => {
    cart.add({ sku: "book", price: 20, quantity: 3 });
    cart.remove("book");
    expect(cart.quantityOf("book")).toBe(0);
    expect(cart.total()).toBe(0);
  });
});
