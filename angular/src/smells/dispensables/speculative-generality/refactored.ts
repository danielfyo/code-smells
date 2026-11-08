import { Injectable, computed, signal } from '@angular/core';

export interface Todo {
  id: number;
  title: string;
  done: boolean;
}

// REFACTOR: Collapse Hierarchy / Remove Parameter / Inline Class. One small store that does
// exactly what the app needs today. Generalize when a second real use case appears.
@Injectable({ providedIn: 'root' })
export class TodoStore {
  private nextId = 1;
  private readonly todosState = signal<readonly Todo[]>([]);

  readonly todos = this.todosState.asReadonly();
  readonly remaining = computed(() => this.todosState().filter((t) => !t.done).length);

  add(title: string): void {
    this.todosState.update((todos) => [...todos, { id: this.nextId++, title, done: false }]);
  }

  toggle(id: number): void {
    this.todosState.update((todos) => todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }
}
