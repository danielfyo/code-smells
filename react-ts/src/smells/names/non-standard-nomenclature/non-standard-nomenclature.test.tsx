import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { counter_widget as SmellyCounter } from "./Smelly";
import { QuantityCounter } from "./Refactored";

describe("non-standard-nomenclature", () => {
  it("smelly increments and notifies", async () => {
    const onChange = vi.fn();
    render(<SmellyCounter start_value={2} when_changed={onChange} />);
    await userEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("button")).toHaveTextContent("Units: 3");
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it("refactored behaves the same", async () => {
    const onChange = vi.fn();
    render(<QuantityCounter initialValue={2} onChange={onChange} />);
    await userEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("button")).toHaveTextContent("Units: 3");
    expect(onChange).toHaveBeenCalledWith(3);
  });
});
