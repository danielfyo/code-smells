import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { PriceInput as Smelly } from "./Smelly";
import { PriceInput as Refactored } from "./Refactored";

describe("props-spreading", () => {
  it("smelly leaks domain props to the DOM and lets type be overridden", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    render(<Smelly label="Price" currency="EUR" type="text" value={5} onChange={() => undefined} />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("currency", "EUR"); // junk attribute in the DOM
    expect(input).toHaveAttribute("label", "Price");
    expect(input).toHaveAttribute("type", "text"); // the internal type="number" was overridden
    errorSpy.mockRestore();
  });

  it("refactored only passes valid attributes to the DOM and keeps its contract", () => {
    function Harness() {
      const [amount, setAmount] = useState(5);
      return <Refactored label="Price" currency="EUR" value={amount} onAmountChange={setAmount} placeholder="0.00" />;
    }
    render(<Harness />);
    const input = screen.getByRole("spinbutton", { name: "Price (EUR)" });
    expect(input).not.toHaveAttribute("currency");
    expect(input).toHaveAttribute("type", "number");
    expect(input).toHaveAttribute("placeholder", "0.00");
    fireEvent.change(input, { target: { value: "7.5" } });
    expect(input).toHaveValue(7.5);
  });
});
