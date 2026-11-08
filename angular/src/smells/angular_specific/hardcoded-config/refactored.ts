import { HttpClient } from '@angular/common/http';
import { EnvironmentProviders, Injectable, InjectionToken, inject, makeEnvironmentProviders } from '@angular/core';
import { Observable, map } from 'rxjs';

export interface CheckoutQuote {
  total: number;
  flow: 'legacy' | 'one-page';
}

// REFACTOR: inject configuration. A typed InjectionToken holds the API URL and feature flags;
// each environment (and each test) provides its own values in app.config.ts via provideShopConfig.
export interface ShopConfig {
  apiUrl: string;
  features: { onePageCheckout: boolean };
}

export const SHOP_CONFIG = new InjectionToken<ShopConfig>('SHOP_CONFIG');

export function provideShopConfig(config: ShopConfig): EnvironmentProviders {
  return makeEnvironmentProviders([{ provide: SHOP_CONFIG, useValue: config }]);
}

@Injectable({ providedIn: 'root' })
export class CheckoutService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(SHOP_CONFIG);

  quote(cartId: string): Observable<CheckoutQuote> {
    return this.http
      .get<{ total: number }>(`${this.config.apiUrl}/carts/${cartId}/quote`)
      .pipe(map(({ total }) => ({ total, flow: this.config.features.onePageCheckout ? 'one-page' : 'legacy' })));
  }
}
