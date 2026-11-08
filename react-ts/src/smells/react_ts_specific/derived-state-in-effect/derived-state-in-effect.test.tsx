import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Profiler } from "react";
import { ProductSearch as Smelly } from "./Smelly";
import { ProductSearch as Refactored } from "./Refactored";

const products = [
  { id: 1, name: "Chair" },
  { id: 2, name: "Chaise" },
  { id: 3, name: "Table" },
];

describe("derived-state-in-effect", () => {
  it.each([
    ["smelly", Smelly],
    ["refactored", Refactored],
  ])("%s filters products while typing", async (_name, Search) => {
    render(<Search products={products} />);
    await userEvent.type(screen.getByLabelText("Search"), "cha");
    expect(screen.getByText("2 results")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem").map((li) => li.textContent)).toEqual(["Chair", "Chaise"]);
  });

  it("smelly needs extra renders to sync derived state", async () => {
    const commits = { smelly: 0, refactored: 0 };
    render(
      <>
        <Profiler id="smelly" onRender={() => commits.smelly++}>
          <Smelly products={products} />
        </Profiler>
        <Profiler id="refactored" onRender={() => commits.refactored++}>
          <Refactored products={products} />
        </Profiler>
      </>,
    );
    commits.smelly = 0;
    commits.refactored = 0;
    const [smellyInput, refactoredInput] = screen.getAllByLabelText("Search");
    await userEvent.type(smellyInput, "t");
    await userEvent.type(refactoredInput, "t");
    expect(commits.refactored).toBe(1);
    expect(commits.smelly).toBeGreaterThan(commits.refactored);
  });
});
