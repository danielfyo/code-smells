import * as Smelly from "./Smelly";
import * as Refactored from "./Refactored";

const products = [
  { sku: "TEA", price: 3 },
  { sku: "MUG", price: 8 },
];
const lines = ["TEA:2", "XXX:1", "MUG:abc", "MUG:1"];

describe("Exceptions for Control Flow", () => {
  it("both compute the same total and the same unknown SKUs", () => {
    const smelly = Smelly.priceList(new Smelly.Catalog(products), lines);
    const refactored = Refactored.priceList(new Refactored.Catalog(products), lines);
    expect(refactored).toEqual(smelly);
    expect(refactored).toEqual({ total: 14, unknown: ["XXX", "MUG"] });
  });

  it("looking up a missing SKU is not an exception in the refactored version", () => {
    expect(() => new Smelly.Catalog(products).get("NOPE")).toThrow(Smelly.NotFoundError);
    expect(new Refactored.Catalog(products).find("NOPE")).toBeUndefined();
  });
});
