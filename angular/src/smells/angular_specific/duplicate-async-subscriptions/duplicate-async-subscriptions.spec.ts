import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection, Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SmellyProductDetailComponent } from './smelly';
import { ProductDetailComponent } from './refactored';

describe('duplicate-async-subscriptions', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideHttpClient(), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  async function render(component: Type<unknown>) {
    const fixture = TestBed.createComponent(component);
    await fixture.whenStable();
    const requests = http.match('/api/products/42');
    requests.forEach((request) => request.flush({ name: 'Espresso machine', price: 199, stock: 4 }));
    await fixture.whenStable();
    const host = fixture.nativeElement as HTMLElement;
    const texts = ['.name', '.price', '.stock'].map((selector) => host.querySelector(selector)?.textContent);
    return { requestCount: requests.length, texts };
  }

  it('smelly: three async pipes send three identical HTTP requests', async () => {
    const { requestCount, texts } = await render(SmellyProductDetailComponent);
    expect(requestCount).toBe(3);
    expect(texts).toEqual(['Espresso machine', '199 EUR', '4 left']);
  });

  it('refactored: a single subscription sends a single request', async () => {
    const { requestCount, texts } = await render(ProductDetailComponent);
    expect(requestCount).toBe(1);
    expect(texts).toEqual(['Espresso machine', '199 EUR', '4 left']);
  });
});
