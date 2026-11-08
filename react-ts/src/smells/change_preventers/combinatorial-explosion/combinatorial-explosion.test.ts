import * as Smelly from "./Smelly";
import { findProducts, allOf, categoryIs, available } from "./Refactored";

const products = [
  { name: "2p tent", category: "camping", price: 80, inStock: true },
  { name: "Sleeping bag", category: "camping", price: 45, inStock: false },
  { name: "Flashlight", category: "camping", price: 15, inStock: true },
  { name: "Helmet", category: "cycling", price: 60, inStock: true },
];

const names = (list: { name: string }[]) => list.map((p) => p.name);

describe("Combinatorial Explosion", () => {
  it("a single function reproduces every variant", () => {
    expect(names(findProducts(products, { category: "camping" }))).toEqual(names(Smelly.byCategory(products, "camping")));
    expect(names(findProducts(products, { maxPrice: 50 }))).toEqual(names(Smelly.byMaxPrice(products, 50)));
    expect(names(findProducts(products, { inStockOnly: true }))).toEqual(names(Smelly.inStock(products)));
    expect(names(findProducts(products, { category: "camping", maxPrice: 50 }))).toEqual(
      names(Smelly.byCategoryAndMaxPrice(products, "camping", 50)),
    );
    expect(names(findProducts(products, { category: "camping", inStockOnly: true }))).toEqual(
      names(Smelly.byCategoryInStock(products, "camping")),
    );
    expect(names(findProducts(products, { maxPrice: 70, inStockOnly: true }))).toEqual(
      names(Smelly.byMaxPriceInStock(products, 70)),
    );
    expect(names(findProducts(products, { category: "camping", maxPrice: 50, inStockOnly: true }))).toEqual(
      names(Smelly.byCategoryAndMaxPriceInStock(products, "camping", 50)),
    );
  });

  it("predicates combine without writing new functions", () => {
    expect(names(products.filter(allOf(categoryIs("cycling"), available)))).toEqual(["Helmet"]);
    expect(findProducts(products)).toHaveLength(4);
  });
});
