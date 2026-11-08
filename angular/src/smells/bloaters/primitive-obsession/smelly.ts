import { Component, Input } from '@angular/core';

// SMELL: Primitive Obsession. The price is a bare number of cents, the currency a free string
// and the discount a number that may be 0.2 or 20 depending on who wrote the caller. The rules
// for rounding, formatting and validating them are re-implemented wherever they are needed.
@Component({
  selector: 'cs-primitive-obsession-smelly',
  template: `
    <p>Monthly: {{ format(priceCents, currency) }}</p>
    <p>Yearly: {{ format(yearlyCents(), currency) }}</p>
    <p>{{ discountLabel() }}</p>
  `,
})
export class PlanPriceSmelly {
  @Input() priceCents = 0;
  @Input() currency = 'EUR';
  // SMELL: is this 15 or 0.15? Only a comment somewhere tells.
  @Input() discountPercent = 0;

  yearlyCents(): number {
    return Math.round(this.priceCents * 12 * (1 - this.discountPercent / 100));
  }

  discountLabel(): string {
    return this.discountPercent > 0 ? `Save ${this.discountPercent}% yearly` : 'No yearly discount';
  }

  // SMELL: formatting knowledge attached to the component instead of the concept it belongs to.
  format(cents: number, currency: string): string {
    const symbol = currency === 'EUR' ? '€' : currency === 'USD' ? '$' : currency;
    return `${(cents / 100).toFixed(2)} ${symbol}`;
  }
}
