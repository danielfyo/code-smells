import { render } from "@testing-library/react";
import { StockBadge as SmellyBadge } from "./Smelly";
import { StockBadge as RefactoredBadge } from "./Refactored";

describe("Clutter", () => {
  it.each([0, 3, 20])("stock %i: same HTML in both versions", (stock) => {
    const product = { name: "Headphones", stock };
    const { container: a } = render(<SmellyBadge product={product} />);
    const { container: b } = render(<RefactoredBadge product={product} />);
    expect(b.innerHTML).toBe(a.innerHTML);
  });

  it("shows the right label", () => {
    const { container } = render(<RefactoredBadge product={{ name: "Mouse", stock: 2 }} />);
    expect(container).toHaveTextContent("Mouse: Last units");
  });
});
