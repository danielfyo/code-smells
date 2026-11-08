import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface CartLine {
  price: number;
  quantity: number;
}

// SMELL: misplaced responsibility. The VAT and free-shipping business rules live inside a
// presentational footer because that is where the author happened to need them. The checkout
// service, the confirmation e-mail or a backend sync must either copy them or instantiate a
// component to do arithmetic.
@Component({
  selector: 'cs-misplaced-responsibility-smelly',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer>
      <p class="shipping">Shipping: {{ shipping() === 0 ? 'free' : shipping().toFixed(2) + ' EUR' }}</p>
      <p class="total">Total: {{ total().toFixed(2) }} EUR</p>
    </footer>
  `,
})
export class SmellyCartFooterComponent {
  readonly lines = input.required<CartLine[]>();

  readonly subtotal = computed(() => this.lines().reduce((s, l) => s + l.price * l.quantity, 0));
  readonly shipping = computed(() => (this.subtotal() >= 50 ? 0 : 4.95));
  readonly total = computed(() => this.subtotal() * 1.21 + this.shipping());
}
