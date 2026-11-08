import { render } from "@testing-library/react";
import { CustomerCard as SmellyCard } from "./Smelly";
import { CustomerCard as RefactoredCard } from "./Refactored";

describe("Overridden Safeties", () => {
  it("with complete data both cards match", () => {
    const customer = { name: "Iris", address: { city: "Bilbao", postalCode: "48001" }, vip: true, points: 120 };
    const { container: a } = render(<SmellyCard customer={customer} />);
    const { container: b } = render(<RefactoredCard customer={customer} />);
    expect(b.textContent).toBe(a.textContent);
    expect(b.textContent).toBe("Iris (BILBAO) · 120 points · VIP");
  });

  it("bug: silencing the compiler causes a runtime failure", () => {
    vi.spyOn(console, "error").mockImplementation(() => {}); // React logs the render error
    expect(() => render(<SmellyCard customer={{ name: "Homeless" }} />)).toThrow(TypeError);
    vi.restoreAllMocks();
  });

  it("the refactored version handles the case the compiler pointed out", () => {
    const { container } = render(<RefactoredCard customer={{ name: "Homeless" }} />);
    expect(container).toHaveTextContent("Homeless (NO ADDRESS) · 0 points");
  });
});
