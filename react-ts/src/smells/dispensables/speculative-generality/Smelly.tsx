import type { ReactNode } from "react";

export interface Task {
  id: number;
  title: string;
  done: boolean;
}

// SMELL: Speculative Generality. To render ONE task list, a generic
// "framework" was built: a renderer interface with a single implementation, an
// empty plugin registry, lifecycle hooks nobody passes and an `orientation`
// parameter that is always "vertical". All of it "just in case".
export interface ItemRenderer<T> {
  render(item: T): ReactNode;
}

export interface ListPlugin<T> {
  transform(items: T[]): T[];
}

interface GenericListProps<T> {
  items: T[];
  renderer: ItemRenderer<T>;
  getKey: (item: T) => string | number;
  plugins?: ListPlugin<T>[];
  onBeforeRender?: (items: T[]) => void;
  orientation?: "vertical" | "horizontal" | "grid";
}

export function GenericList<T>({
  items,
  renderer,
  getKey,
  plugins = [],
  onBeforeRender,
  orientation = "vertical",
}: GenericListProps<T>) {
  const processed = plugins.reduce((acc, plugin) => plugin.transform(acc), items);
  onBeforeRender?.(processed);
  return (
    <ul data-orientation={orientation}>
      {processed.map((item) => (
        <li key={getKey(item)}>{renderer.render(item)}</li>
      ))}
    </ul>
  );
}

// SMELL: the only implementation that exists for the whole abstraction.
class TaskRenderer implements ItemRenderer<Task> {
  render(task: Task): ReactNode {
    return task.done ? <s>{task.title}</s> : task.title;
  }
}

export function TaskList({ tasks }: { tasks: Task[] }) {
  return <GenericList items={tasks} renderer={new TaskRenderer()} getKey={(t) => t.id} />;
}
