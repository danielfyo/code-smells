import { act, render, screen } from "@testing-library/react";
import { AutoCounter as Smelly } from "./Smelly";
import { AutoCounter as Refactored } from "./Refactored";

describe("stale-closure", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("smelly gets stuck at 1 because it reads the initial count", () => {
    render(<Smelly />);
    act(() => vi.advanceTimersByTime(3000));
    expect(screen.getByText("Visits: 1")).toBeInTheDocument();
  });

  it("refactored increments on every tick", () => {
    render(<Refactored />);
    act(() => vi.advanceTimersByTime(3000));
    expect(screen.getByText("Visits: 3")).toBeInTheDocument();
  });

  it("refactored honors the new step; smelly ignores it", () => {
    const smelly = render(<Smelly step={1} />);
    smelly.rerender(<Smelly step={10} />);
    act(() => vi.advanceTimersByTime(2000));
    expect(smelly.getByText("Visits: 1")).toBeInTheDocument();
    smelly.unmount();

    const refactored = render(<Refactored step={1} />);
    act(() => vi.advanceTimersByTime(1000));
    refactored.rerender(<Refactored step={10} />);
    act(() => vi.advanceTimersByTime(2000));
    expect(refactored.getByText("Visits: 21")).toBeInTheDocument();
  });
});
