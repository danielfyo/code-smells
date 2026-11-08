import { render, screen } from "@testing-library/react";
import { OrdersTable as SmellyTable } from "./Smelly";
import { OrdersTable as RefactoredTable } from "./Refactored";

const orders = [
  { id: "A-1", customer: "Bea", total: 19.9 },
  { id: "A-2", customer: "Teo", total: 250 },
];

describe("Lazy Class", () => {
  it("the table renders the same HTML without the lazy pieces", () => {
    const { container: a } = render(<SmellyTable orders={orders} />);
    const { container: b } = render(<RefactoredTable orders={orders} />);
    expect(b.innerHTML).toBe(a.innerHTML);
    expect(screen.getAllByText("250.00 €")).toHaveLength(2);
  });
});
