import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

// REFACTOR: Remove Clutter. Only the imports, members and statements that do something remain.
@Component({
  selector: 'cs-clutter-refactored',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p>{{ label() }}</p>
    <button type="button" (click)="subscribe()">Subscribe</button>
  `,
})
export class NewsletterSignupRefactored {
  readonly topic = input('');
  private readonly count = signal(0);
  private readonly subscribed = signal(false);

  protected readonly label = computed(() =>
    this.subscribed()
      ? `Subscribed to ${this.topic()} (${this.count()})`
      : `Join ${this.count()} readers of ${this.topic()}`,
  );

  subscribe(): void {
    if (this.subscribed()) return;
    this.subscribed.set(true);
    this.count.update((n) => n + 1);
  }
}
