import { summarizeCatalog, type CatalogProduct } from "./production";

// REFACTOR: a minimal inline fixture built with a helper. All the data that explains the
// expected result is visible inside the test itself.
const product = (overrides: Partial<CatalogProduct>): CatalogProduct => ({
  sku: "SKU",
  price: 0,
  active: true,
  ...overrides,
});

describe("summarizeCatalog (refactored)", () => {
  it("counts only active products and averages their price", () => {
    const products = [
      product({ price: 10 }),
      product({ price: 25 }),
      product({ price: 99, active: false }),
      product({ price: 40 }),
    ];
    expect(summarizeCatalog(products)).toEqual({ activeCount: 3, averagePrice: 25 });
  });

  it("returns an average of 0 when nothing is active", () => {
    expect(summarizeCatalog([product({ active: false })])).toEqual({ activeCount: 0, averagePrice: 0 });
  });
});
