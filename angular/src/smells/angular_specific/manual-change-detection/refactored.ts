import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { NotificationsApi } from './notifications.api';

// REFACTOR: make state reactive. A signal notifies Angular whenever it changes, so the view
// updates by itself (zoneless or not): no ChangeDetectorRef, no setTimeout, nothing to forget.
@Component({
  selector: 'cs-manual-change-detection-refactored',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p class="count">{{ unread() }} unread</p>
    <button type="button" class="dismiss" (click)="dismissAll()">Dismiss all</button>
  `,
})
export class NotificationBellComponent {
  private readonly api = inject(NotificationsApi);
  private readonly items = signal<string[]>([]);
  readonly unread = computed(() => this.items().length);

  constructor() {
    void this.api.load().then((items) => this.items.set(items));
  }

  dismissAll(): void {
    this.items.set([]);
  }
}
