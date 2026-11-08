import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App as SmellyApp } from "./Smelly";
import { App as RefactoredApp } from "./Refactored";

describe("prop-drilling", () => {
  it.each([
    ["smelly", SmellyApp],
    ["refactored", RefactoredApp],
  ])("%s shows the user and allows logging out", async (_name, App) => {
    const onLogout = vi.fn();
    render(<App user={{ name: "Anna", role: "customer" }} onLogout={onLogout} />);
    expect(screen.getByText("Hi, Anna")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Log out" }));
    expect(onLogout).toHaveBeenCalledTimes(1);
  });
});
