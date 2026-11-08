import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface Product {
  name: string;
  price: number;
  stock: number;
  tags: string[];
}

const SALE_TAG = 'sale';
const SALE_PRICE_FACTOR = 0.8; // 20% off
const LOW_STOCK_LIMIT = 5;

// REFACTOR: Replace clever code with intention-revealing steps: named predicates, filter + map
// instead of a side-effecting reduce, and `some` for "is there any...".
const isOnSale = (product: Product) => product.stock > 0 && product.tags.includes(SALE_TAG);
const isRunningOut = (product: Product) => product.stock > 0 && product.stock < LOW_STOCK_LIMIT;

@Component({
  selector: 'cs-obscured-intent-refactored',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p class="sale">{{ saleItems().length }} on sale, {{ saleTotal().toFixed(2) }} EUR</p>
    <p class="alert">{{ hasLowStock() ? 'Low stock!' : 'Stock OK' }}</p>
  `,
})
export class SaleSummaryComponent {
  readonly products = input.required<Product[]>();

  readonly saleItems = computed(() => this.products().filter(isOnSale));
  readonly saleTotal = computed(() =>
    this.saleItems().reduce((sum, product) => sum + product.price * SALE_PRICE_FACTOR, 0),
  );
  readonly hasLowStock = computed(() => this.products().some(isRunningOut));
}
