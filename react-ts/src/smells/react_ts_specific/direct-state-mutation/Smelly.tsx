import { useState } from "react";

export interface Task {
  id: number;
  title: string;
  done: boolean;
}

// SMELL: direct state mutation. The existing array and object are modified and setState
// is called with the SAME reference: React compares with Object.is, sees no change and
// doesn't re-render. The UI gets out of sync with the data.
export function TaskList({ initialTasks }: { initialTasks: Task[] }) {
  const [tasks, setTasks] = useState(initialTasks);

  const addTask = () => {
    tasks.push({ id: tasks.length + 1, title: `Task ${tasks.length + 1}`, done: false });
    setTasks(tasks); // SMELL: same reference
  };

  const toggle = (task: Task) => {
    task.done = !task.done; // SMELL: mutates the state object (and the props)
    setTasks(tasks);
  };

  return (
    <div>
      <button onClick={addTask}>Add</button>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <label>
              <input type="checkbox" checked={task.done} onChange={() => toggle(task)} />
              {task.title}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
