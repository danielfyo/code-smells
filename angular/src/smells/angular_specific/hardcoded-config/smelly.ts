import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

export interface CheckoutQuote {
  total: number;
  flow: 'legacy' | 'one-page';
}

// SMELL: hard-coded configuration in a service. The production API URL and a feature flag are
// literals inside the class. Staging, local development and tests all hit production, and
// flipping the flag needs a code change and a redeploy.
@Injectable({ providedIn: 'root' })
export class SmellyCheckoutService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://api.shop-production.example/v2';
  private readonly onePageCheckout = false;

  quote(cartId: string): Observable<CheckoutQuote> {
    return this.http
      .get<{ total: number }>(`${this.apiUrl}/carts/${cartId}/quote`)
      .pipe(map(({ total }) => ({ total, flow: this.onePageCheckout ? 'one-page' : 'legacy' })));
  }
}
