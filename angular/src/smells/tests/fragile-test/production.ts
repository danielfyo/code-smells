import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

// Production code: a small to-do list.
interface Todo {
  id: number;
  title: string;
  done: boolean;
}

@Component({
  selector: 'cs-fragile-test-todo-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form (submit)="add(title.value); title.value = ''; $event.preventDefault()">
      <label>New task <input #title name="title" /></label>
      <button type="submit">Add</button>
    </form>
    <div class="wrapper">
      <ul>
        @for (todo of todos(); track todo.id) {
          <li>
            <label><input type="checkbox" [checked]="todo.done" (change)="toggle(todo.id)" /> {{ todo.title }}</label>
          </li>
        }
      </ul>
    </div>
    <p role="status">{{ pending() }} pending</p>
  `,
})
export class TodoListComponent {
  private nextId = 1;
  protected readonly todos = signal<Todo[]>([]);
  protected readonly pending = computed(() => this.todos().filter((todo) => !todo.done).length);

  protected add(title: string): void {
    if (!title.trim()) return;
    this.todos.update((todos) => [...todos, { id: this.nextId++, title: title.trim(), done: false }]);
  }

  protected toggle(id: number): void {
    this.todos.update((todos) => todos.map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo)));
  }
}
