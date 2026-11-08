import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

export interface Task {
  id: number;
  title: string;
}

// SMELL: tracking by index on a reorderable list. When the list is sorted, Angular sees "row 0 is
// still row 0" and reuses the same DOM nodes, only updating the bindings. Everything not bound
// (what the user typed, focus, an expanded panel, a child component's state) stays at the old
// position and ends up attached to a different task.
@Component({
  selector: 'cs-index-as-track-smelly',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button type="button" class="reverse" (click)="reverse()">Reverse</button>
    <ul>
      @for (task of tasks(); track $index) {
        <li>
          <span class="title">{{ task.title }}</span>
          <input class="note" placeholder="Note" />
        </li>
      }
    </ul>
  `,
})
export class SmellyTaskBoardComponent {
  readonly tasks = signal<Task[]>([
    { id: 1, title: 'Write report' },
    { id: 2, title: 'Call supplier' },
    { id: 3, title: 'Book flights' },
  ]);

  reverse(): void {
    this.tasks.update((tasks) => [...tasks].reverse());
  }
}
