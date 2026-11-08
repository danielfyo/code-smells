import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CustomerApi } from './customer.api';
import { SmellyCustomerCardComponent } from './smelly';
import { CustomerCardComponent } from './refactored';

describe('constructor-logic', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  it('smelly: the constructor fires the request before the input is set', async () => {
    const fixture = TestBed.createComponent(SmellyCustomerCardComponent);
    fixture.componentRef.setInput('customerId', '42');
    await fixture.whenStable();
    expect(TestBed.inject(CustomerApi).requestedIds).toEqual([undefined]);
    expect((fixture.nativeElement as HTMLElement).querySelector('.name')?.textContent).toBe('Unknown customer');
  });

  it('refactored: loads the customer of the input, and reloads when it changes', async () => {
    const fixture = TestBed.createComponent(CustomerCardComponent);
    fixture.componentRef.setInput('customerId', '42');
    await fixture.whenStable();
    expect((fixture.nativeElement as HTMLElement).querySelector('.name')?.textContent).toBe('Ana Ruiz');

    fixture.componentRef.setInput('customerId', '7');
    await fixture.whenStable();
    expect(TestBed.inject(CustomerApi).requestedIds).toEqual(['42', '7']);
    expect((fixture.nativeElement as HTMLElement).querySelector('.name')?.textContent).toBe('Unknown customer');
  });
});
