import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaskList as Smelly, type Task } from "./Smelly";
import { TaskList as Refactored } from "./Refactored";

const makeTasks = (): Task[] => [{ id: 1, title: "Task 1", done: false }];

describe("direct-state-mutation", () => {
  it("smelly does not re-render on add and also mutates the props", async () => {
    const tasks = makeTasks();
    render(<Smelly initialTasks={tasks} />);
    await userEvent.click(screen.getByRole("button", { name: "Add" }));
    expect(screen.getAllByRole("listitem")).toHaveLength(1); // the UI never finds out
    expect(tasks).toHaveLength(2); // but the original array was mutated
  });

  it("refactored re-renders and leaves the props untouched", async () => {
    const tasks = makeTasks();
    render(<Refactored initialTasks={tasks} />);
    await userEvent.click(screen.getByRole("button", { name: "Add" }));
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    await userEvent.click(screen.getByLabelText("Task 1"));
    expect(screen.getByLabelText("Task 1")).toBeChecked();
    expect(tasks).toEqual(makeTasks());
  });
});
