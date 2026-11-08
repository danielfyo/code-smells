import { render, screen } from "@testing-library/react";
import { CartFooter as SmellyFooter } from "./Smelly";
import { CartFooter as RefactoredFooter } from "./Refactored";
import { calculateCartTotals } from "./cartPricing";

describe("misplaced-responsibility", () => {
  it.each([
    ["smelly", SmellyFooter],
    ["refactored", RefactoredFooter],
  ])("%s shows shipping and total", (_name, Footer) => {
    const { unmount } = render(<Footer lines={[{ price: 10, quantity: 2 }]} />);
    expect(screen.getByText("Shipping: 4.95 €")).toBeInTheDocument();
    expect(screen.getByText("Total: 29.15 €")).toBeInTheDocument();
    unmount();
    render(<Footer lines={[{ price: 50, quantity: 1 }]} />);
    expect(screen.getByText("Shipping: free")).toBeInTheDocument();
  });

  it("the business rule can be tested without rendering anything", () => {
    expect(calculateCartTotals([{ price: 100, quantity: 1 }])).toEqual({ subtotal: 100, vat: 21, shipping: 0, total: 121 });
  });
});
