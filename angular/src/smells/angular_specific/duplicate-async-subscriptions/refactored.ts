import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProductDetailApi } from './product.api';

// REFACTOR: subscribe once and reuse the value. `@let` (or `@if (... | async; as product)`, or
// toSignal) creates a single subscription whose value every binding reads.
@Component({
  selector: 'cs-duplicate-async-subscriptions-refactored',
  imports: [AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let product = product$ | async;
    <h2 class="name">{{ product?.name }}</h2>
    <p class="price">{{ product?.price }} EUR</p>
    <p class="stock">{{ product?.stock }} left</p>
  `,
})
export class ProductDetailComponent {
  readonly product$ = inject(ProductDetailApi).byId(42);
}
