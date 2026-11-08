import { Injectable, InjectionToken, inject } from '@angular/core';

/** Low-level transport (a thin wrapper over fetch in the real app, a fake in tests). */
export type Transport = (url: string, timeoutMs: number) => Promise<string>;
export const SMELLY_TRANSPORT = new InjectionToken<Transport>('SMELLY_TRANSPORT');

// SMELL: configurable data at low levels. The base URL, the timeout and the retry count are
// buried in a private helper three calls deep. Pointing staging at a staging server or tuning
// retries means editing (and redeploying) the code.
async function requestWithRetry(transport: Transport, path: string): Promise<string> {
  const url = 'https://api.shop-production.example/v1' + path;
  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return await transport(url, 5000);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

@Injectable({ providedIn: 'root' })
export class SmellyOrderStatusClient {
  private readonly transport = inject(SMELLY_TRANSPORT);

  status(orderId: number): Promise<string> {
    return requestWithRetry(this.transport, `/orders/${orderId}/status`);
  }
}
