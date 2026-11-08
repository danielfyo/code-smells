import { ChangeDetectionStrategy, Component, Injectable, InjectionToken, computed, inject, input } from '@angular/core';

// REFACTOR: Replace Static with Injectable Dependency. The clock is a DI token with a sensible
// default, so it can be swapped per application, per component tree or per test.
export const CLOCK = new InjectionToken<() => Date>('CLOCK', {
  providedIn: 'root',
  factory: () => () => new Date(),
});

const WEEKEND_SURCHARGE = 1.2;

@Injectable({ providedIn: 'root' })
export class TicketPricing {
  private readonly now = inject(CLOCK);

  priceFor(baseCents: number): number {
    const day = this.now().getDay();
    const weekend = day === 0 || day === 6;
    return weekend ? Math.round(baseCents * WEEKEND_SURCHARGE) : baseCents;
  }
}

@Component({
  selector: 'cs-inappropriate-static-refactored',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p>Ticket: {{ price().toFixed(2) }} €</p>`,
})
export class MuseumTicketRefactored {
  readonly baseCents = input(0);
  private readonly pricing = inject(TicketPricing);
  protected readonly price = computed(() => this.pricing.priceFor(this.baseCents()) / 100);
}
