import * as smelly from "./Smelly";
import * as refactored from "./Refactored";

const products = [
  { name: "Chair", price: 50, stock: 3, tags: ["sale"] },
  { name: "Table", price: 200, stock: 0, tags: ["sale"] },
  { name: "Lamp", price: 30, stock: 10, tags: ["new", "sale"] },
  { name: "Sofa", price: 500, stock: 8, tags: [] },
];

describe("obscured-intent", () => {
  it("both versions summarize in-stock products on sale", () => {
    expect(smelly.summarize(products)).toEqual({ n: 2, t: 64 });
    expect(refactored.summarize(products)).toEqual(smelly.summarize(products));
  });

  it("both versions detect low stock", () => {
    expect(smelly.lowStock(products)).toBe(true);
    expect(refactored.lowStock(products)).toBe(true);
    const plenty = products.filter((p) => p.stock === 0 || p.stock >= 5);
    expect(smelly.lowStock(plenty)).toBe(false);
    expect(refactored.lowStock(plenty)).toBe(false);
  });
});
