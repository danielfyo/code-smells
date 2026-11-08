import { render } from "@testing-library/react";
import { Paginator as SmellyPaginator, pageCount as smellyPageCount } from "./Smelly";
import { Paginator as RefactoredPaginator, pageCount } from "./Refactored";

const letters = (n: number) => Array.from({ length: n }, (_, i) => String.fromCharCode(65 + i));

describe("Incorrect Behavior at the Boundaries", () => {
  it("in the typical case both versions agree", () => {
    for (const page of [1, 2, 3]) {
      const { container: a } = render(<SmellyPaginator items={letters(7)} size={3} page={page} />);
      const { container: b } = render(<RefactoredPaginator items={letters(7)} size={3} page={page} />);
      expect(b.innerHTML).toBe(a.innerHTML);
    }
  });

  it("bug: with an exact multiple the smelly version invents an empty page", () => {
    expect(smellyPageCount(6, 3)).toBe(3);
    expect(pageCount(6, 3)).toBe(2);
  });

  it("bug: with an empty list the smelly version says 'Page 1 of 1'", () => {
    const { container: a } = render(<SmellyPaginator items={[]} size={3} page={1} />);
    expect(a).toHaveTextContent("Page 1 of 1");
    const { container: b } = render(<RefactoredPaginator items={[]} size={3} page={1} />);
    expect(b).toHaveTextContent("No results");
  });

  it("an out-of-range page is clamped in the refactored version", () => {
    const { container: a } = render(<SmellyPaginator items={letters(4)} size={3} page={9} />);
    expect(a.querySelectorAll("li")).toHaveLength(0);
    const { container: b } = render(<RefactoredPaginator items={letters(4)} size={3} page={9} />);
    expect(b).toHaveTextContent("Page 2 of 2");
    expect(b.querySelectorAll("li")).toHaveLength(1);
  });
});
