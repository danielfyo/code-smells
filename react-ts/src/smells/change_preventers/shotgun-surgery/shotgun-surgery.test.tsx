import { render, screen } from "@testing-library/react";
import { Cart as SmellyCart } from "./Smelly";
import { Cart as RefactoredCart } from "./Refactored";

const lines = [
  { product: "Book", net: 20, qty: 2 },
  { product: "Pencil", net: 1.5, qty: 4 },
];

describe("Shotgun Surgery", () => {
  it("both carts display exactly the same content", () => {
    const { container: a } = render(<SmellyCart lines={lines} />);
    const { container: b } = render(<RefactoredCart lines={lines} />);
    expect(b.textContent).toBe(a.textContent);
  });

  it("computes total and VAT from a single module", () => {
    render(<RefactoredCart lines={lines} />);
    expect(screen.getByText("Total: 55.66 €")).toBeInTheDocument();
    expect(screen.getByText("VAT included (21%): 9.66 €")).toBeInTheDocument();
  });
});
