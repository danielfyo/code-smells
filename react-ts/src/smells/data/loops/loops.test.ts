import { topCategories as smelly } from "./Smelly";
import { topCategories as refactored } from "./Refactored";

const sales = [
  { product: "Laptop", category: "computing", units: 1, unitPrice: 900, refunded: false },
  { product: "Mouse", category: "computing", units: 3, unitPrice: 20, refunded: false },
  { product: "Pan", category: "home", units: 2, unitPrice: 35, refunded: false },
  { product: "TV", category: "video", units: 1, unitPrice: 600, refunded: true },
  { product: "Novel", category: "books", units: 5, unitPrice: 18, refunded: false },
];

describe("Loops", () => {
  it.each([1, 2, 10])("top %i matches in both versions", (limit) => {
    expect(refactored(sales, limit)).toEqual(smelly(sales, limit));
  });

  it("excludes refunds and sorts by revenue", () => {
    expect(refactored(sales, 3)).toEqual([
      { category: "computing", revenue: 960 },
      { category: "books", revenue: 90 },
      { category: "home", revenue: 70 },
    ]);
  });
});
