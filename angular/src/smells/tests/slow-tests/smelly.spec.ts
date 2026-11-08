import { HttpInterceptorFn, HttpResponse, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { delay, firstValueFrom, of } from 'rxjs';
import { ExchangeRateService } from './production';

// SMELL: slow test. The suite goes through a (simulated) real server with real latency: each
// request waits on the wall clock. Here it is 250 ms; against the real staging API it is seconds,
// plus outages. Multiply by hundreds of tests and nobody runs the suite before pushing.
const stagingServer: HttpInterceptorFn = () =>
  of(new HttpResponse({ status: 200, body: { base: 'EUR', rates: { USD: 1.1, GBP: 0.85 } } })).pipe(delay(250));

describe('ExchangeRateService (smelly)', () => {
  it('converts euros to dollars', async () => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideHttpClient(withInterceptors([stagingServer]))],
    });
    const started = Date.now();
    expect(await firstValueFrom(TestBed.inject(ExchangeRateService).convert(10, 'USD'))).toBe(11);
    expect(Date.now() - started).toBeGreaterThanOrEqual(200);
  });
});
