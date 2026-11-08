import { ChangeDetectionStrategy, Component, effect, signal } from '@angular/core';

export interface Room {
  name: string;
  nightlyRate: number;
}

@Component({
  selector: 'cs-effect-for-derived-state-smelly',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p class="quote">{{ nights() }} nights: {{ total() }} EUR</p>`,
})
export class SmellyStayQuoteComponent {
  readonly room = signal<Room>({ name: 'Double', nightlyRate: 90 });
  readonly nights = signal(2);

  // SMELL: effect() for derived state. `total` is a writable signal kept in sync by an effect.
  // Effects run later (during change detection), so between a change and the next flush `total`
  // is stale; anyone can also set it to an inconsistent value. It is also an extra re-render.
  readonly total = signal(0);

  constructor() {
    effect(() => {
      this.total.set(this.room().nightlyRate * this.nights());
    });
  }
}
