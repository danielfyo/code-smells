import { fireEvent, render, screen } from "@testing-library/react";
import { BookingQuote as Smelly } from "./Smelly";
import { BookingQuote as Refactored } from "./Refactored";
import { quoteStay } from "./bookingPricing";

const room = { name: "Double sea view", pricePerNight: 100 };

describe("business-logic-in-components", () => {
  it.each([
    ["smelly", Smelly],
    ["refactored", Refactored],
  ])("%s computes the quote in the UI", (_name, Quote) => {
    render(<Quote room={room} />);
    expect(screen.getByText("Price: 100.00 €")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Nights"), { target: { value: "7" } });
    fireEvent.click(screen.getByLabelText("Includes weekend"));
    expect(screen.getByText("Price: 714.00 €")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Nights"), { target: { value: "0" } });
    expect(screen.getByRole("alert")).toHaveTextContent("Minimum one night");
  });

  it("refactored lets you test the rule without React", () => {
    expect(quoteStay(100, 2, true)).toEqual({ ok: true, price: 240 });
    expect(quoteStay(100, 0, false)).toEqual({ ok: false, error: "Minimum one night" });
  });
});
