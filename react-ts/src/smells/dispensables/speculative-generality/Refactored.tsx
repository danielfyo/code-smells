export interface Task {
  id: number;
  title: string;
  done: boolean;
}

// REFACTOR: Collapse Hierarchy + Inline Function + Remove Parameter (YAGNI).
// The generic machinery nobody used is removed. If a second kind of list ever
// shows up, the abstraction will be extracted from real use cases.
export function TaskList({ tasks }: { tasks: Task[] }) {
  return (
    <ul data-orientation="vertical">
      {tasks.map((task) => (
        <li key={task.id}>{task.done ? <s>{task.title}</s> : task.title}</li>
      ))}
    </ul>
  );
}
