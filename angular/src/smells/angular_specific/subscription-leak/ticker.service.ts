import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

/** Live stock prices. Counts active subscribers so the tests can detect leaks. */
@Injectable({ providedIn: 'root' })
export class StockTickerService {
  private readonly feed = new Subject<number>();
  activeSubscriptions = 0;

  readonly price$ = new Observable<number>((subscriber) => {
    this.activeSubscriptions++;
    const inner = this.feed.subscribe(subscriber);
    return () => {
      this.activeSubscriptions--;
      inner.unsubscribe();
    };
  });

  publish(price: number): void {
    this.feed.next(price);
  }
}
