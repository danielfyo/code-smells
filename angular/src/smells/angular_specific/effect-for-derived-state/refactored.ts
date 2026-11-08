import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

export interface Room {
  name: string;
  nightlyRate: number;
}

// REFACTOR: Replace effect with computed. Derived state is declared as a pure function of its
// sources: always consistent when read, lazily memoized and read-only for consumers. Keep
// effect() for side effects that leave the signal graph (logging, storage, DOM APIs).
@Component({
  selector: 'cs-effect-for-derived-state-refactored',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p class="quote">{{ nights() }} nights: {{ total() }} EUR</p>`,
})
export class StayQuoteComponent {
  readonly room = signal<Room>({ name: 'Double', nightlyRate: 90 });
  readonly nights = signal(2);
  readonly total = computed(() => this.room().nightlyRate * this.nights());
}
