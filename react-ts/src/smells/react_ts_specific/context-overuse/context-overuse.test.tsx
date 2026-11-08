import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as smelly from "./Smelly";
import * as refactored from "./Refactored";

describe.each([
  ["smelly", smelly],
  ["refactored", refactored],
])("context-overuse (%s)", (name, { AppProvider, ThemeToggle, CartButton }) => {
  it("toggles the theme and adds to the cart", async () => {
    render(
      <AppProvider>
        <ThemeToggle />
        <CartButton />
      </AppProvider>,
    );
    await userEvent.click(screen.getByRole("button", { name: /Cart/ }));
    await userEvent.click(screen.getByRole("button", { name: /Theme/ }));
    expect(screen.getByRole("button", { name: "Cart (1)" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Theme: dark" })).toBeInTheDocument();
  });

  it(`adding to the cart ${name === "smelly" ? "DOES" : "does NOT"} re-render the theme toggle`, async () => {
    const onThemeRender = vi.fn();
    render(
      <AppProvider>
        <ThemeToggle onRender={onThemeRender} />
        <CartButton />
      </AppProvider>,
    );
    onThemeRender.mockClear();
    await userEvent.click(screen.getByRole("button", { name: /Cart/ }));
    await userEvent.click(screen.getByRole("button", { name: /Cart/ }));
    expect(onThemeRender).toHaveBeenCalledTimes(name === "smelly" ? 2 : 0);
  });
});
