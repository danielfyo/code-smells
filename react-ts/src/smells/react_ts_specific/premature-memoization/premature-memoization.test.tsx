import { fireEvent, render, screen } from "@testing-library/react";
import { TipCalculator as Smelly } from "./Smelly";
import { TipCalculator as Refactored } from "./Refactored";

describe("premature-memoization", () => {
  it.each([
    ["smelly", Smelly],
    ["refactored", Refactored],
  ])("%s computes the total with tip", (_name, Calculator) => {
    render(<Calculator />);
    expect(screen.getByText("Total: 55.00 €")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Bill"), { target: { value: "80" } });
    fireEvent.change(screen.getByLabelText("Tip %"), { target: { value: "15" } });
    expect(screen.getByText("Total: 92.00 €")).toBeInTheDocument();
  });
});
