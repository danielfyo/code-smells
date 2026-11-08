import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type CurrencyCode = 'EUR' | 'USD' | 'GBP';

const SYMBOLS: Record<CurrencyCode, string> = { EUR: '€', USD: '$', GBP: 'GBP' };

// REFACTOR: Replace Primitive with Object. Money keeps cents and currency together, rounds in
// one place and knows how to format itself.
export class Money {
  private constructor(
    readonly cents: number,
    readonly currency: CurrencyCode,
  ) {}

  static ofCents(cents: number, currency: CurrencyCode): Money {
    if (!Number.isInteger(cents) || cents < 0) {
      throw new RangeError(`Invalid amount: ${cents}`);
    }
    return new Money(cents, currency);
  }

  times(factor: number): Money {
    return new Money(Math.round(this.cents * factor), this.currency);
  }

  toString(): string {
    return `${(this.cents / 100).toFixed(2)} ${SYMBOLS[this.currency]}`;
  }
}

// REFACTOR: Replace Primitive with Object. A percentage can only be built from 0-100.
export class Percentage {
  private constructor(readonly value: number) {}

  static of(value: number): Percentage {
    if (value < 0 || value > 100) {
      throw new RangeError(`Percentage out of range: ${value}`);
    }
    return new Percentage(value);
  }

  get isZero(): boolean {
    return this.value === 0;
  }

  remainingFraction(): number {
    return 1 - this.value / 100;
  }
}

@Component({
  selector: 'cs-primitive-obsession-refactored',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p>Monthly: {{ monthly() }}</p>
    <p>Yearly: {{ yearly() }}</p>
    <p>{{ discountLabel() }}</p>
  `,
})
export class PlanPriceRefactored {
  readonly monthly = input.required<Money>();
  readonly discount = input(Percentage.of(0));

  protected readonly yearly = computed(() => this.monthly().times(12 * this.discount().remainingFraction()));
  protected readonly discountLabel = computed(() =>
    this.discount().isZero ? 'No yearly discount' : `Save ${this.discount().value}% yearly`,
  );
}
