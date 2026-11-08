import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ExchangeRateService } from './production';

// REFACTOR: replace the network with an in-memory test double. HttpTestingController answers
// synchronously, so the test runs in microseconds and never depends on a server being up.
describe('ExchangeRateService (refactored)', () => {
  let http: HttpTestingController;
  let service: ExchangeRateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideHttpClient(), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpTestingController);
    service = TestBed.inject(ExchangeRateService);
  });

  afterEach(() => http.verify());

  it('converts euros to dollars', () => {
    let result: number | undefined;
    service.convert(10, 'USD').subscribe((value) => (result = value));
    http.expectOne('/api/rates?base=EUR').flush({ base: 'EUR', rates: { USD: 1.1 } });
    expect(result).toBe(11);
  });

  it('fails for unknown currencies', () => {
    let error: unknown;
    service.convert(10, 'XYZ').subscribe({ error: (e: unknown) => (error = e) });
    http.expectOne('/api/rates?base=EUR').flush({ base: 'EUR', rates: {} });
    expect(error).toEqual(new Error('Unknown currency XYZ'));
  });
});
