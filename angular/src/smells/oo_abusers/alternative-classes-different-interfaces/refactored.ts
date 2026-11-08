import { ChangeDetectionStrategy, Component, InjectionToken, computed, inject, input } from '@angular/core';

export interface Parcel {
  grams: number;
  country: string;
}

// REFACTOR: Extract Superclass / Unify Interfaces. Both providers implement the same contract,
// with the same units, so they are interchangeable.
export interface ShippingRateProvider {
  readonly name: string;
  quoteCents(parcel: Parcel): number;
}

export class PostalRates implements ShippingRateProvider {
  readonly name = 'Postal';
  quoteCents({ grams, country }: Parcel): number {
    const base = country === 'ES' ? 350 : 900;
    return Math.round(base + (grams / 1000) * 120);
  }
}

export class CourierRates implements ShippingRateProvider {
  readonly name = 'Courier';
  quoteCents({ grams, country }: Parcel): number {
    return (country === 'ES' ? 590 : 1490) + Math.ceil(grams / 500) * 100;
  }
}

// REFACTOR: providers are injected as a list; adding one does not touch the component.
export const SHIPPING_RATE_PROVIDERS = new InjectionToken<readonly ShippingRateProvider[]>('SHIPPING_RATE_PROVIDERS', {
  providedIn: 'root',
  factory: () => [new PostalRates(), new CourierRates()],
});

@Component({
  selector: 'cs-alternative-classes-refactored',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (quote of quotes(); track quote.name) {
      <p>{{ quote.name }}: {{ (quote.cents / 100).toFixed(2) }} €</p>
    }
  `,
})
export class ShippingQuotesRefactored {
  readonly grams = input(0);
  readonly country = input('ES');

  private readonly providers = inject(SHIPPING_RATE_PROVIDERS);

  protected readonly quotes = computed(() => {
    const parcel: Parcel = { grams: this.grams(), country: this.country() };
    return this.providers.map((provider) => ({ name: provider.name, cents: provider.quoteCents(parcel) }));
  });
}
