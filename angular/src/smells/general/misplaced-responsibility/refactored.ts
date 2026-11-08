import { ChangeDetectionStrategy, Component, Injectable, computed, inject, input } from '@angular/core';

export interface CartLine {
  price: number;
  quantity: number;
}

export interface CartTotals {
  subtotal: number;
  shipping: number;
  total: number;
}

const VAT_RATE = 0.21;
const FREE_SHIPPING_FROM = 50;
const SHIPPING_FEE = 4.95;

// REFACTOR: Move Function to where the reader expects it. Pricing rules belong to a pricing
// service that checkout, e-mails and the UI can all inject; the component only presents.
@Injectable({ providedIn: 'root' })
export class CartPricingService {
  totals(lines: readonly CartLine[]): CartTotals {
    const subtotal = lines.reduce((sum, line) => sum + line.price * line.quantity, 0);
    const shipping = subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FEE;
    return { subtotal, shipping, total: subtotal * (1 + VAT_RATE) + shipping };
  }
}

@Component({
  selector: 'cs-misplaced-responsibility-refactored',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer>
      <p class="shipping">Shipping: {{ totals().shipping === 0 ? 'free' : totals().shipping.toFixed(2) + ' EUR' }}</p>
      <p class="total">Total: {{ totals().total.toFixed(2) }} EUR</p>
    </footer>
  `,
})
export class CartFooterComponent {
  private readonly pricing = inject(CartPricingService);
  readonly lines = input.required<CartLine[]>();
  readonly totals = computed(() => this.pricing.totals(this.lines()));
}
