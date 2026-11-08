import { render, screen } from "@testing-library/react";
import * as smelly from "./Smelly";
import * as refactored from "./Refactored";

const products = [
  { id: 1, name: "Coffee", price: 3.5 },
  { id: 2, name: "Tea", price: 2 },
];

describe("multiple-languages-in-file", () => {
  it.each([
    ["smelly", smelly.ProductList],
    ["refactored", refactored.ProductList],
  ])("%s renders the same product list", (_name, ProductList) => {
    render(<ProductList products={products} />);
    const items = screen.getAllByRole("listitem");
    expect(items.map((li) => li.textContent)).toEqual(["Coffee 3.50 €", "Tea 2.00 €"]);
  });

  it("smelly concatenates input into SQL (injection); refactored parameterizes it", () => {
    const malicious = "x' OR '1'='1";
    expect(smelly.buildProductQuery(malicious)).toContain("OR '1'='1'");
    const query = refactored.buildProductQuery(malicious);
    expect(query.text).not.toContain(malicious);
    expect(query.values).toEqual([malicious]);
  });
});
