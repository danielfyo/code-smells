import { render, screen } from "@testing-library/react";
import { CheckoutSummary as SmellySummary } from "./Smelly";
import { CheckoutSummary as RefactoredSummary, couponDiscount, shippingFor } from "./Refactored";

const items = [
  { sku: "A1", name: "Mug", unitPrice: 12.5, quantity: 2 },
  { sku: "B2", name: "Coffee", unitPrice: 8, quantity: 3 },
];

const scenarios = [
  { items, couponCode: "welcome10", country: "ES" },
  { items, couponCode: "FLAT5", country: "PT" },
  { items: items.slice(0, 1), country: "US" },
];

describe("Long Method", () => {
  it.each(scenarios)("both versions render the same markup (%#)", (props) => {
    const { container: smelly } = render(<SmellySummary {...props} />);
    const { container: refactored } = render(<RefactoredSummary {...props} />);
    expect(refactored.innerHTML).toBe(smelly.innerHTML);
  });

  it("shows the total with discount, taxes and shipping", () => {
    render(<RefactoredSummary items={items} couponCode="WELCOME10" country="ES" />);
    // 49 - 4.9 = 44.1 -> +21% = 53.361 -> shipping 4.99 (44.1 < 50)
    expect(screen.getByText("Total: 58.35 €")).toBeInTheDocument();
  });

  it("the extracted functions can be tested on their own", () => {
    expect(couponDiscount(10, "FLAT5")).toBe(0);
    expect(couponDiscount(30, " flat5 ")).toBe(5);
    expect(shippingFor(50)).toBe(0);
  });
});
