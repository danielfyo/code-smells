import { useState } from "react";

export interface Task {
  id: number;
  title: string;
  done: boolean;
}

// REFACTOR: immutable updates. A new array and a new object are created with spread and
// map; React detects the new reference and re-renders. Props are never touched.
export function TaskList({ initialTasks }: { initialTasks: Task[] }) {
  const [tasks, setTasks] = useState(initialTasks);

  const addTask = () => {
    setTasks((current) => [
      ...current,
      { id: current.length + 1, title: `Task ${current.length + 1}`, done: false },
    ]);
  };

  const toggle = (id: number) => {
    setTasks((current) => current.map((task) => (task.id === id ? { ...task, done: !task.done } : task)));
  };

  return (
    <div>
      <button onClick={addTask}>Add</button>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <label>
              <input type="checkbox" checked={task.done} onChange={() => toggle(task.id)} />
              {task.title}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
