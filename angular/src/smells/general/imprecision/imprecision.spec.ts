import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SmellyBillingService } from './smelly';
import { BillingService, toCents } from './refactored';

describe('imprecision', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  it('smelly: floats make a correctly paid invoice look unpaid', () => {
    const billing = TestBed.inject(SmellyBillingService);
    const invoice = { customerEmail: 'ana@shop.test', lines: [0.1, 0.2] };
    expect(billing.total(invoice)).not.toBe(0.3);
    expect(billing.isFullyPaid(invoice, 0.3)).toBe(false);
  });

  it('refactored: integer cents are exact', () => {
    const billing = TestBed.inject(BillingService);
    const invoice = { customerEmail: 'ana@shop.test', lines: [toCents(0.1), toCents(0.2)] };
    expect(billing.total(invoice)).toBe(30);
    expect(billing.isFullyPaid(invoice, toCents(0.3))).toBe(true);
  });

  it('smelly: [0] silently picks one of several matches; refactored refuses to guess', () => {
    const invoices = [
      { customerEmail: 'ana@shop.test', lines: [100] },
      { customerEmail: 'ana@shop.test', lines: [200] },
    ];
    expect(TestBed.inject(SmellyBillingService).findByEmail(invoices, 'ana@shop.test').lines).toEqual([100]);
    expect(() => TestBed.inject(BillingService).findByEmail(invoices, 'ana@shop.test')).toThrowError(/Several invoices/);
    expect(TestBed.inject(BillingService).findByEmail(invoices, 'leo@shop.test')).toBeUndefined();
  });
});
