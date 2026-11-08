import { fireEvent, render, screen } from "@testing-library/react";
import { Shop as SmellyShop, cartStore } from "./Smelly";
import { Shop as RefactoredShop } from "./Refactored";

function clickBoth() {
  fireEvent.click(screen.getByRole("button", { name: "Add T-shirt" }));
  fireEvent.click(screen.getByRole("button", { name: "Add Cap" }));
}

describe("Global Data", () => {
  it("both shops count the added items", () => {
    cartStore.items = [];
    const { unmount } = render(<SmellyShop />);
    clickBoth();
    expect(screen.getByLabelText("counter")).toHaveTextContent("2 items");
    unmount();

    render(<RefactoredShop />);
    clickBoth();
    expect(screen.getByLabelText("counter")).toHaveTextContent("2 items");
  });

  it("with global data, state leaks between mounts", () => {
    const { unmount } = render(<SmellyShop />);
    // What was added in the previous test is still there.
    expect(screen.getByLabelText("counter")).not.toHaveTextContent("0 items");
    unmount();
  });

  it("with context, every tree starts clean and is independent", () => {
    render(<RefactoredShop />);
    expect(screen.getByLabelText("counter")).toHaveTextContent("0 items");
  });
});
