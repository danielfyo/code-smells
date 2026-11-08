import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SmellyStockPriceComponent } from './smelly';
import { StockPriceComponent } from './refactored';
import { StockTickerService } from './ticker.service';

describe('subscription-leak', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  it.each([SmellyStockPriceComponent, StockPriceComponent])('%o shows the latest price', async (component) => {
    const fixture = TestBed.createComponent<SmellyStockPriceComponent | StockPriceComponent>(component);
    await fixture.whenStable();
    TestBed.inject(StockTickerService).publish(101.5);
    await fixture.whenStable();
    expect((fixture.nativeElement as HTMLElement).querySelector('.price')?.textContent).toBe('Last price: 101.5');
  });

  it('smelly: the subscription survives the component and keeps handling prices', async () => {
    const ticker = TestBed.inject(StockTickerService);
    const fixture = TestBed.createComponent(SmellyStockPriceComponent);
    await fixture.whenStable();
    fixture.destroy();
    ticker.publish(99);
    expect(ticker.activeSubscriptions).toBe(1);
    expect(fixture.componentInstance.updatesHandled).toBe(1);
  });

  it('refactored: destroying the component closes the subscription', async () => {
    const ticker = TestBed.inject(StockTickerService);
    const fixture = TestBed.createComponent(StockPriceComponent);
    await fixture.whenStable();
    expect(ticker.activeSubscriptions).toBe(1);
    fixture.destroy();
    ticker.publish(99);
    expect(ticker.activeSubscriptions).toBe(0);
    expect(fixture.componentInstance.updatesHandled).toBe(0);
  });
});
