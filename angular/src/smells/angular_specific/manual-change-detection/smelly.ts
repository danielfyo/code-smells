import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { NotificationsApi } from './notifications.api';

@Component({
  selector: 'cs-manual-change-detection-smelly',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p class="count">{{ items.length }} unread</p>
    <button type="button" class="dismiss" (click)="dismissAll()">Dismiss all</button>
  `,
})
export class SmellyNotificationBellComponent implements OnInit {
  private readonly api = inject(NotificationsApi);
  private readonly cdr = inject(ChangeDetectorRef);
  items: string[] = [];

  // SMELL: manual change detection hacks. State is a plain field Angular cannot observe, so the
  // author forces the view to update: detectChanges() here, markForCheck() there and a
  // setTimeout "because otherwise it does not refresh". Forget one call and the UI goes stale.
  ngOnInit(): void {
    this.api.load().then((items) => {
      this.items = items;
      this.cdr.detectChanges();
      setTimeout(() => this.cdr.markForCheck());
    });
  }

  dismissAll(): void {
    this.items = [];
    this.cdr.markForCheck();
  }
}
