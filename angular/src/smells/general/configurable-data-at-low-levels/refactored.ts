import { Injectable, InjectionToken, inject } from '@angular/core';

export type Transport = (url: string, timeoutMs: number) => Promise<string>;
export const TRANSPORT = new InjectionToken<Transport>('TRANSPORT');

// REFACTOR: Lift configuration to the top. The values are declared once, in one typed object
// provided at application start (e.g. in app.config.ts per environment), and passed down.
export interface ApiConfig {
  baseUrl: string;
  timeoutMs: number;
  retries: number;
}

export const API_CONFIG = new InjectionToken<ApiConfig>('API_CONFIG', {
  providedIn: 'root',
  factory: () => ({ baseUrl: 'https://api.shop-production.example/v1', timeoutMs: 5000, retries: 3 }),
});

async function requestWithRetry(transport: Transport, config: ApiConfig, path: string): Promise<string> {
  let lastError: unknown;
  for (let attempt = 0; attempt < config.retries; attempt++) {
    try {
      return await transport(config.baseUrl + path, config.timeoutMs);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

@Injectable({ providedIn: 'root' })
export class OrderStatusClient {
  private readonly transport = inject(TRANSPORT);
  private readonly config = inject(API_CONFIG);

  status(orderId: number): Promise<string> {
    return requestWithRetry(this.transport, this.config, `/orders/${orderId}/status`);
  }
}
