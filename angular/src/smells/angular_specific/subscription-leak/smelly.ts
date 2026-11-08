import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { StockTickerService } from './ticker.service';

@Component({
  selector: 'cs-subscription-leak-smelly',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p class="price">Last price: {{ lastPrice }}</p>`,
})
export class SmellyStockPriceComponent implements OnInit {
  private readonly ticker = inject(StockTickerService);
  private readonly cdr = inject(ChangeDetectorRef);
  lastPrice = 0;
  updatesHandled = 0;

  // SMELL: subscription leak. subscribe() without unsubscribe, takeUntilDestroyed or the async
  // pipe. When the user navigates away the component is destroyed, but the subscription keeps it
  // alive in memory and its callback keeps running for every new price: forever.
  ngOnInit(): void {
    this.ticker.price$.subscribe((price) => {
      this.lastPrice = price;
      this.updatesHandled++;
      this.cdr.markForCheck();
    });
  }
}
