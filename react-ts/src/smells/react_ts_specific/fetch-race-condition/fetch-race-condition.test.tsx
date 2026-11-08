import { act, render, screen } from "@testing-library/react";
import { ProductSearch as Smelly } from "./Smelly";
import { ProductSearch as Refactored } from "./Refactored";

// Fake search whose responses the test resolves by hand, in whatever order it wants.
function controlledSearch() {
  const pending = new Map<string, (results: string[]) => void>();
  const search = (query: string) => new Promise<string[]>((resolve) => pending.set(query, resolve));
  const respond = async (query: string, results: string[]) => {
    await act(async () => pending.get(query)?.(results));
  };
  return { search, respond };
}

describe("fetch-race-condition", () => {
  it("smelly: the slow response of an old search overwrites the current one", async () => {
    const { search, respond } = controlledSearch();
    const { rerender } = render(<Smelly query="ch" search={search} />);
    rerender(<Smelly query="chair" search={search} />);
    await respond("chair", ["Red chair"]);
    await respond("ch", ["Chaise", "Red chair", "Cherry"]); // arrives late
    expect(screen.getAllByRole("listitem")).toHaveLength(3); // results for "ch" shown for "chair"
  });

  it("refactored: ignores the stale response", async () => {
    const { search, respond } = controlledSearch();
    const { rerender } = render(<Refactored query="ch" search={search} />);
    rerender(<Refactored query="chair" search={search} />);
    await respond("chair", ["Red chair"]);
    await respond("ch", ["Chaise", "Red chair", "Cherry"]);
    expect(screen.getAllByRole("listitem").map((li) => li.textContent)).toEqual(["Red chair"]);
  });
});
