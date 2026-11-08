import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

// Production code: converts prices using the exchange-rate API.
interface RatesResponse {
  base: string;
  rates: Record<string, number>;
}

@Injectable({ providedIn: 'root' })
export class ExchangeRateService {
  private readonly http = inject(HttpClient);

  convert(amountEur: number, currency: string): Observable<number> {
    return this.http.get<RatesResponse>('/api/rates?base=EUR').pipe(
      map((response) => {
        const rate = response.rates[currency];
        if (rate === undefined) throw new Error(`Unknown currency ${currency}`);
        return Math.round(amountEur * rate * 100) / 100;
      }),
    );
  }
}
