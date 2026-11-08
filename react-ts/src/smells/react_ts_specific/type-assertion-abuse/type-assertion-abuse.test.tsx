import * as smelly from "./Smelly";
import * as refactored from "./Refactored";

const good = [
  { id: 1, name: "Coffee", price: 3 },
  { id: 2, name: "Tea", price: 2 },
];
const bad = [{ id: 1, name: "Coffee", price: "free" }];

describe("type-assertion-abuse", () => {
  it("with correct data both versions behave the same", async () => {
    const fromSmelly = await smelly.loadProducts(async () => good);
    const fromRefactored = await refactored.loadProducts(async () => good);
    expect(smelly.cheapestPrice(fromSmelly)).toBe(2);
    expect(refactored.cheapestPrice(fromRefactored)).toBe(2);
  });

  it("smelly accepts wrongly shaped data and produces NaN", async () => {
    const products = await smelly.loadProducts(async () => bad);
    expect(smelly.cheapestPrice(products)).toBeNaN();
  });

  it("refactored detects the wrong format", async () => {
    await expect(refactored.loadProducts(async () => bad)).rejects.toThrow(TypeError);
  });

  it("the double assertion produces an object that is not a Product", () => {
    expect(smelly.toProduct(["1", "Coffee", "3"]).name).toBeUndefined();
    expect(refactored.toProduct(["1", "Coffee", "3"])).toEqual({ id: 1, name: "Coffee", price: 3 });
  });
});
