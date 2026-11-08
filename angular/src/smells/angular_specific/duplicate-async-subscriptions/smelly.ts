import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProductDetailApi } from './product.api';

// SMELL: duplicate async subscriptions. Each `| async` subscribes separately to the same cold
// HTTP observable, so this template fires three identical requests (and may even show values
// from different responses side by side).
@Component({
  selector: 'cs-duplicate-async-subscriptions-smelly',
  imports: [AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 class="name">{{ (product$ | async)?.name }}</h2>
    <p class="price">{{ (product$ | async)?.price }} EUR</p>
    <p class="stock">{{ (product$ | async)?.stock }} left</p>
  `,
})
export class SmellyProductDetailComponent {
  readonly product$ = inject(ProductDetailApi).byId(42);
}
