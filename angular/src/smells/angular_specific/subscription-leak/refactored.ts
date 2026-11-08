import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { StockTickerService } from './ticker.service';

// REFACTOR: tie the subscription to the component lifetime. toSignal() subscribes in the
// injection context and unsubscribes automatically on destroy (takeUntilDestroyed is the
// equivalent for imperative subscribe() calls; the async pipe for templates).
@Component({
  selector: 'cs-subscription-leak-refactored',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p class="price">Last price: {{ lastPrice() }}</p>`,
})
export class StockPriceComponent {
  private readonly ticker = inject(StockTickerService);
  updatesHandled = 0;

  readonly lastPrice = toSignal(
    this.ticker.price$.pipe(
      tap(() => this.updatesHandled++),
      takeUntilDestroyed(),
    ),
    { initialValue: 0 },
  );
}
