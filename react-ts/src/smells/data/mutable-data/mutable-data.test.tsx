import { render } from "@testing-library/react";
import { Leaderboard as SmellyBoard } from "./Smelly";
import { Leaderboard as RefactoredBoard } from "./Refactored";

const makePlayers = () => [
  { name: "Cy", points: 30 },
  { name: "Ada", points: 50 },
  { name: "Bo", points: 55 },
];

describe("Mutable Data", () => {
  it("the first render is identical", () => {
    const { container: a } = render(<SmellyBoard players={makePlayers()} streakName="Ada" />);
    const { container: b } = render(<RefactoredBoard players={makePlayers()} streakName="Ada" />);
    expect(b.textContent).toBe(a.textContent);
    expect(b.textContent).toBe("Ada: 60Bo: 55Cy: 30");
  });

  it("the smelly version alters the parent's data (and stacks a bonus on every render)", () => {
    const players = makePlayers();
    const { rerender, container } = render(<SmellyBoard players={players} streakName="Ada" />);
    // The parent's array was reordered in place (it used to be Cy, Ada, Bo).
    expect(players.map((p) => p.name)).toEqual(["Ada", "Bo", "Cy"]);
    expect(players.find((p) => p.name === "Ada")?.points).toBe(60);
    rerender(<SmellyBoard players={players} streakName="Ada" />);
    expect(container.textContent).toContain("Ada: 70"); // bonus applied twice
  });

  it("the refactored version leaves its props untouched and is stable across renders", () => {
    const players = makePlayers();
    const snapshot = JSON.stringify(players);
    const { rerender, container } = render(<RefactoredBoard players={players} streakName="Ada" />);
    rerender(<RefactoredBoard players={players} streakName="Ada" />);
    expect(JSON.stringify(players)).toBe(snapshot);
    expect(container.textContent).toContain("Ada: 60");
  });
});
