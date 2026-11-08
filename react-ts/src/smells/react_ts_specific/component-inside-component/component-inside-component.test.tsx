import { fireEvent, render, screen } from "@testing-library/react";
import { CheckoutPage as Smelly } from "./Smelly";
import { CheckoutPage as Refactored } from "./Refactored";

function setQuantityThenTypeCoupon() {
  fireEvent.change(screen.getByLabelText("Quantity"), { target: { value: "5" } });
  fireEvent.change(screen.getByLabelText("Coupon"), { target: { value: "SUMMER" } });
}

describe("component-inside-component", () => {
  it("smelly loses the quantity when the parent re-renders", () => {
    render(<Smelly />);
    setQuantityThenTypeCoupon();
    expect(screen.getByLabelText("Quantity")).toHaveValue(1);
  });

  it("refactored keeps the quantity", () => {
    render(<Refactored />);
    setQuantityThenTypeCoupon();
    expect(screen.getByLabelText("Quantity")).toHaveValue(5);
    expect(screen.getByLabelText("Coupon")).toHaveValue("SUMMER");
  });
});
