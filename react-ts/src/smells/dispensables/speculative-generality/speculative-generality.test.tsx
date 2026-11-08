import { render } from "@testing-library/react";
import { TaskList as SmellyList } from "./Smelly";
import { TaskList as RefactoredList } from "./Refactored";

const tasks = [
  { id: 1, title: "Buy bread", done: true },
  { id: 2, title: "Call the plumber", done: false },
];

describe("Speculative Generality", () => {
  it("the simple list renders the same as the speculative framework", () => {
    const { container: a } = render(<SmellyList tasks={tasks} />);
    const { container: b } = render(<RefactoredList tasks={tasks} />);
    expect(b.innerHTML).toBe(a.innerHTML);
    expect(b.querySelector("s")).toHaveTextContent("Buy bread");
  });
});
