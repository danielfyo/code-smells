import { fireEvent, render, screen } from "@testing-library/react";
import { SignupButton as SmellyButton } from "./Smelly";
import { SignupButton as RefactoredButton } from "./Refactored";

describe.each([
  ["Smelly", SmellyButton],
  ["Refactored", RefactoredButton],
])("Negative Conditionals (%s)", (_label, SignupButton) => {
  it("only enables the button with a valid email and accepted terms", () => {
    render(<SignupButton email="ana@mail.com" />);
    const button = screen.getByRole("button", { name: "Create account" });
    expect(button).toBeDisabled();
    fireEvent.click(screen.getByRole("checkbox"));
    expect(button).toBeEnabled();
    expect(screen.queryByText("Invalid email")).not.toBeInTheDocument();
  });

  it("with an invalid email it shows the warning and stays disabled", () => {
    render(<SignupButton email="ana" />);
    fireEvent.click(screen.getByRole("checkbox"));
    expect(screen.getByRole("button")).toBeDisabled();
    expect(screen.getByText("Invalid email")).toBeInTheDocument();
  });
});
