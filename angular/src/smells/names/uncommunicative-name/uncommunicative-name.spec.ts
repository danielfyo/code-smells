import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SmellyOrderStatsService } from './smelly';
import { Order, OrderStatsService } from './refactored';

describe('uncommunicative-name', () => {
  const orders: Order[] = [
    { amount: 40, status: 'PAID', customerId: 'ana' },
    { amount: 90, status: 'PENDING', customerId: 'ana' },
    { amount: 500, status: 'X', customerId: 'ana' },
    { amount: 70, status: 'PAID', customerId: 'luis' },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  it('both versions summarize the non-cancelled orders of a customer', () => {
    const smelly = TestBed.inject(SmellyOrderStatsService).proc(
      orders.map((o) => ({ a: o.amount, s: o.status, c: o.customerId })),
      'ana',
    );
    const refactored = TestBed.inject(OrderStatsService).summarizeCustomerOrders(orders, 'ana');
    expect(smelly).toEqual({ n: 2, t: 130, x: 90 });
    expect(refactored).toEqual({ orderCount: 2, totalSpent: 130, largestOrder: 90 });
  });

  it('a customer without orders gets an empty summary', () => {
    expect(TestBed.inject(OrderStatsService).summarizeCustomerOrders(orders, 'eva')).toEqual({
      orderCount: 0,
      totalSpent: 0,
      largestOrder: 0,
    });
    expect(TestBed.inject(SmellyOrderStatsService).proc([], 'eva')).toEqual({ n: 0, t: 0, x: 0 });
  });
});
