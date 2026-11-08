import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SmellyOrderHistoryComponent } from './smelly';
import { OrderHistoryComponent } from './refactored';

const flushMicrotasks = () => new Promise<void>((resolve) => setTimeout(resolve));

describe('promise-observable-mixing', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideHttpClient(), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpTestingController);
  });

  it.each([SmellyOrderHistoryComponent, OrderHistoryComponent])('%o renders the same summary', async (component) => {
    const fixture = TestBed.createComponent<SmellyOrderHistoryComponent | OrderHistoryComponent>(component);
    await fixture.whenStable();
    http.expectOne('/api/me').flush({ id: 3, name: 'Ana' });
    await flushMicrotasks();
    http.expectOne('/api/users/3/orders').flush([{ id: 1, total: 20 }, { id: 2, total: 15 }]);
    await flushMicrotasks();
    http.expectOne('/api/settings').flush({ currency: 'EUR' });
    await fixture.whenStable();
    expect((fixture.nativeElement as HTMLElement).querySelector('.summary')?.textContent).toBe('Ana: 2 orders, 35 EUR');
    http.verify();
  });

  it('smelly: leaving the page does not stop the flow; requests and writes continue', async () => {
    const fixture = TestBed.createComponent(SmellyOrderHistoryComponent);
    await fixture.whenStable();
    const me = http.expectOne('/api/me');
    fixture.destroy();
    me.flush({ id: 3, name: 'Ana' });
    await flushMicrotasks();
    http.expectOne('/api/users/3/orders').flush([]); // still requested after destroy
    await flushMicrotasks();
    http.expectOne('/api/settings').flush({ currency: 'EUR' });
    expect(fixture.componentInstance.writesAfterLoad).toBe(1);
  });

  it('refactored: destroying the component cancels the in-flight request and the rest of the chain', async () => {
    const fixture = TestBed.createComponent(OrderHistoryComponent);
    await fixture.whenStable();
    const me = http.expectOne('/api/me');
    fixture.destroy();
    expect(me.cancelled).toBe(true);
    http.expectNone('/api/users/3/orders');
    http.verify();
  });
});
