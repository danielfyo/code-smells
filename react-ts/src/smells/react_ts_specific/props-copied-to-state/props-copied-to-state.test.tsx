import { render, screen } from "@testing-library/react";
import { PriceTag as Smelly } from "./Smelly";
import { PriceTag as Refactored } from "./Refactored";

describe("props-copied-to-state", () => {
  it("both versions render the initial value", () => {
    render(<Smelly price={10} label="T-shirt" />);
    render(<Refactored price={10} label="T-shirt" />);
    expect(screen.getAllByText("T-SHIRT: 10.00 €")).toHaveLength(2);
  });

  it("smelly ignores prop changes (bug)", () => {
    const { rerender } = render(<Smelly price={10} label="T-shirt" />);
    rerender(<Smelly price={7.5} label="Sale" />);
    expect(screen.getByText("T-SHIRT: 10.00 €")).toBeInTheDocument();
  });

  it("refactored always reflects the current prop", () => {
    const { rerender } = render(<Refactored price={10} label="T-shirt" />);
    rerender(<Refactored price={7.5} label="Sale" />);
    expect(screen.getByText("SALE: 7.50 €")).toBeInTheDocument();
  });
});
