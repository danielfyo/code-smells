import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

export interface Task {
  id: number;
  title: string;
}

// REFACTOR: track by a stable identity. With `track task.id` Angular moves the existing DOM nodes
// together with their item, so per-row state (typed text, focus, child state) follows the task.
@Component({
  selector: 'cs-index-as-track-refactored',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button type="button" class="reverse" (click)="reverse()">Reverse</button>
    <ul>
      @for (task of tasks(); track task.id) {
        <li>
          <span class="title">{{ task.title }}</span>
          <input class="note" placeholder="Note" />
        </li>
      }
    </ul>
  `,
})
export class TaskBoardComponent {
  readonly tasks = signal<Task[]>([
    { id: 1, title: 'Write report' },
    { id: 2, title: 'Call supplier' },
    { id: 3, title: 'Book flights' },
  ]);

  reverse(): void {
    this.tasks.update((tasks) => [...tasks].reverse());
  }
}
