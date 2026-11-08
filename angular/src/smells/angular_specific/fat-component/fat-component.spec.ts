import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SmellyOrdersDashboardComponent } from './smelly';
import { Order, OrdersDashboardComponent, revenueOf } from './refactored';

const orders: Order[] = [
  { id: 1, customer: 'Ana', total: 600, status: 'paid' },
  { id: 2, customer: 'Leo', total: 80, status: 'pending' },
  { id: 3, customer: 'Eva', total: 300, status: 'cancelled' },
];

type Dashboard = typeof SmellyOrdersDashboardComponent | typeof OrdersDashboardComponent;

describe('fat-component', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideHttpClient(), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it.each<Dashboard>([SmellyOrdersDashboardComponent, OrdersDashboardComponent])('%o renders orders, revenue and the filter', async (component) => {
    const fixture = TestBed.createComponent<SmellyOrdersDashboardComponent | OrdersDashboardComponent>(component);
    await fixture.whenStable();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('.loading')).not.toBeNull();

    http.expectOne((req) => req.urlWithParams === `/api/orders?year=${new Date().getFullYear()}`).flush(orders);
    await fixture.whenStable();
    expect([...host.querySelectorAll('tr')].map((tr) => tr.textContent)).toEqual(['Ana600', 'Leo80']);
    expect(host.querySelector('tr.vip')?.textContent).toBe('Ana600');
    expect(host.querySelector('.revenue')?.textContent).toBe('Revenue: 600 EUR');

    host.querySelector<HTMLInputElement>('.only-paid')?.click();
    await fixture.whenStable();
    expect([...host.querySelectorAll('tr')].map((tr) => tr.textContent)).toEqual(['Ana600']);
  });

  it.each<Dashboard>([SmellyOrdersDashboardComponent, OrdersDashboardComponent])('%o shows an error when loading fails', async (component) => {
    const fixture = TestBed.createComponent<SmellyOrdersDashboardComponent | OrdersDashboardComponent>(component);
    await fixture.whenStable();
    http.expectOne((req) => req.url.startsWith('/api/orders')).flush('boom', { status: 500, statusText: 'Server Error' });
    await fixture.whenStable();
    expect((fixture.nativeElement as HTMLElement).querySelector('.error')?.textContent).toBe('Could not load orders');
  });

  it('refactored: the business rules are testable without any component', () => {
    expect(revenueOf(orders)).toBe(600);
  });
});
