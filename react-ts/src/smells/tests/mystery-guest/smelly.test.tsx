import { summarizeCatalog } from "./production";
// SMELL: mystery guest. The data comes from an external file you can't see when reading
// the test. Why 3 active? Why 25? You have to open another file (shared with other
// tests, which anyone may modify) to understand the assertion.
import catalog from "./catalog-fixture.json";

describe("summarizeCatalog (smelly)", () => {
  it("summarizes the catalog", () => {
    expect(summarizeCatalog(catalog)).toEqual({ activeCount: 3, averagePrice: 25 });
  });
});
