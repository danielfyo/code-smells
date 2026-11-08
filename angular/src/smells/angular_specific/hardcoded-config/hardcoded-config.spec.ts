import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { SmellyCheckoutService } from './smelly';
import { CheckoutService, provideShopConfig, ShopConfig } from './refactored';

function setup(config: ShopConfig) {
  TestBed.configureTestingModule({
    providers: [provideZonelessChangeDetection(), provideHttpClient(), provideHttpClientTesting(), provideShopConfig(config)],
  });
  return TestBed.inject(HttpTestingController);
}

describe('hardcoded-config', () => {
  it('both services behave the same with the production configuration', async () => {
    const http = setup({ apiUrl: 'https://api.shop-production.example/v2', features: { onePageCheckout: false } });
    const smelly = firstValueFrom(TestBed.inject(SmellyCheckoutService).quote('c1'));
    const refactored = firstValueFrom(TestBed.inject(CheckoutService).quote('c1'));
    http.match('https://api.shop-production.example/v2/carts/c1/quote').forEach((req) => req.flush({ total: 30 }));
    expect(await smelly).toEqual({ total: 30, flow: 'legacy' });
    expect(await refactored).toEqual({ total: 30, flow: 'legacy' });
    http.verify();
  });

  it('smelly: even in a test environment it calls production', () => {
    const http = setup({ apiUrl: 'http://staging.test/v2', features: { onePageCheckout: true } });
    TestBed.inject(SmellyCheckoutService).quote('c1').subscribe();
    http.expectOne('https://api.shop-production.example/v2/carts/c1/quote').flush({ total: 1 });
    http.verify();
  });

  it('refactored: URL and feature flags come from the provided configuration', async () => {
    const http = setup({ apiUrl: 'http://staging.test/v2', features: { onePageCheckout: true } });
    const quote = firstValueFrom(TestBed.inject(CheckoutService).quote('c1'));
    http.expectOne('http://staging.test/v2/carts/c1/quote').flush({ total: 30 });
    expect(await quote).toEqual({ total: 30, flow: 'one-page' });
    http.verify();
  });
});
