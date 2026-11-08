import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as smelly from "./Smelly";
import * as refactored from "./Refactored";

const customers = [
  { id: 1, name: "Anna", email: "anna@shop.com" },
  { id: 2, name: "Luke" },
];

describe("non-null-assertion", () => {
  it("with complete data both versions return the domain", () => {
    expect(smelly.customerEmailDomain(customers, 1)).toBe("shop.com");
    expect(refactored.customerEmailDomain(customers, 1)).toBe("shop.com");
  });

  it("smelly blows up at runtime when data is missing", () => {
    expect(() => smelly.customerEmailDomain(customers, 2)).toThrow(TypeError);
    expect(() => smelly.customerEmailDomain(customers, 99)).toThrow(TypeError);
  });

  it("refactored models absence with undefined", () => {
    expect(refactored.customerEmailDomain(customers, 2)).toBeUndefined();
    expect(refactored.customerEmailDomain(customers, 99)).toBeUndefined();
  });

  it.each([
    ["smelly", smelly.SearchBox],
    ["refactored", refactored.SearchBox],
  ])("%s focuses the search box when the button is clicked", async (_name, SearchBox) => {
    render(<SearchBox />);
    await userEvent.click(screen.getByRole("button", { name: "Search" }));
    expect(screen.getByLabelText("Search customer")).toHaveFocus();
  });
});
