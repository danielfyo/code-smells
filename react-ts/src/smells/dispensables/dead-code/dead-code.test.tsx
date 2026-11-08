import { fireEvent, render, screen } from "@testing-library/react";
import { CouponBox as SmellyBox } from "./Smelly";
import { CouponBox as RefactoredBox } from "./Refactored";

describe.each([
  ["Smelly", SmellyBox],
  ["Refactored", RefactoredBox],
])("Dead Code (%s)", (_label, CouponBox) => {
  it("applies the clicked coupon in upper case", () => {
    render(<CouponBox codes={["summer5", "bf20"]} />);
    expect(screen.getByText("No coupon applied")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "bf20" }));
    expect(screen.getByText("Applied: BF20")).toBeInTheDocument();
  });
});

it("both versions render the same initial HTML", () => {
  const { container: a } = render(<SmellyBox codes={["X"]} showLegacyBanner />);
  const { container: b } = render(<RefactoredBox codes={["X"]} />);
  expect(b.innerHTML).toBe(a.innerHTML);
});
