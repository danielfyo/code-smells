import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface OrderSummary {
  subtotal: number;
  shipping: number;
  discount: number;
}

// SMELL: oddball solution. The same problem (showing a euro amount) is solved three different
// ways in one component: toFixed + replace, Intl.NumberFormat, and a hand-made string split that
// truncates instead of rounding. Each has its own quirks and fixes must be applied three times.
@Component({
  selector: 'cs-oddball-solution-smelly',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p class="subtotal">{{ subtotalLabel() }}</p>
    <p class="shipping">{{ shippingLabel() }}</p>
    <p class="discount">{{ discountLabel() }}</p>
  `,
})
export class SmellyOrderSummaryComponent {
  readonly order = input.required<OrderSummary>();

  subtotalLabel(): string {
    return this.order().subtotal.toFixed(2).replace('.', ',') + ' €';
  }

  shippingLabel(): string {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(this.order().shipping);
  }

  discountLabel(): string {
    const [int, dec = ''] = String(this.order().discount).split('.');
    return `${int},${(dec + '00').slice(0, 2)} €`;
  }
}
