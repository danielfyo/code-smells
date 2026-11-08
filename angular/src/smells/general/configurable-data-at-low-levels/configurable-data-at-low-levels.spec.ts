import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SMELLY_TRANSPORT, SmellyOrderStatusClient } from './smelly';
import { API_CONFIG, OrderStatusClient, Transport, TRANSPORT } from './refactored';

function flakyTransport(failures: number) {
  const calls: { url: string; timeoutMs: number }[] = [];
  const transport: Transport = async (url, timeoutMs) => {
    calls.push({ url, timeoutMs });
    if (calls.length <= failures) throw new Error('network down');
    return 'SHIPPED';
  };
  return { transport, calls };
}

describe('configurable-data-at-low-levels', () => {
  it('both versions retry and return the same status with the default settings', async () => {
    const smellyFake = flakyTransport(2);
    const refactoredFake = flakyTransport(2);
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        { provide: SMELLY_TRANSPORT, useValue: smellyFake.transport },
        { provide: TRANSPORT, useValue: refactoredFake.transport },
      ],
    });
    expect(await TestBed.inject(SmellyOrderStatusClient).status(7)).toBe('SHIPPED');
    expect(await TestBed.inject(OrderStatusClient).status(7)).toBe('SHIPPED');
    expect(smellyFake.calls).toEqual(refactoredFake.calls);
    expect(refactoredFake.calls[0]).toEqual({ url: 'https://api.shop-production.example/v1/orders/7/status', timeoutMs: 5000 });
  });

  it('refactored: another environment only provides another configuration', async () => {
    const fake = flakyTransport(1);
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        { provide: TRANSPORT, useValue: fake.transport },
        { provide: API_CONFIG, useValue: { baseUrl: 'https://staging.example/v1', timeoutMs: 100, retries: 1 } },
      ],
    });
    await expect(TestBed.inject(OrderStatusClient).status(7)).rejects.toThrowError('network down');
    expect(fake.calls).toEqual([{ url: 'https://staging.example/v1/orders/7/status', timeoutMs: 100 }]);
  });
});
