import { act, render, screen } from "@testing-library/react";
import { SessionTimer as Smelly } from "./Smelly";
import { SessionTimer as Refactored } from "./Refactored";

describe("missing-effect-cleanup", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it.each([
    ["smelly", Smelly],
    ["refactored", Refactored],
  ])("%s counts seconds while mounted", (_name, Timer) => {
    render(<Timer />);
    act(() => vi.advanceTimersByTime(3000));
    expect(screen.getByText(/Session: 3s/)).toBeInTheDocument();
  });

  it("smelly keeps running the interval and leaves the listener after unmount", () => {
    const onTick = vi.fn();
    const removeSpy = vi.spyOn(window, "removeEventListener");
    const { unmount } = render(<Smelly onTick={onTick} />);
    unmount();
    act(() => vi.advanceTimersByTime(3000));
    expect(onTick).toHaveBeenCalled(); // the timer is still alive: leak
    expect(removeSpy).not.toHaveBeenCalledWith("resize", expect.any(Function));
  });

  it("refactored clears the interval and the listener on unmount", () => {
    const onTick = vi.fn();
    const removeSpy = vi.spyOn(window, "removeEventListener");
    const { unmount } = render(<Refactored onTick={onTick} />);
    unmount();
    act(() => vi.advanceTimersByTime(3000));
    expect(onTick).not.toHaveBeenCalled();
    expect(removeSpy).toHaveBeenCalledWith("resize", expect.any(Function));
    expect(vi.getTimerCount()).toBe(0);
  });
});
