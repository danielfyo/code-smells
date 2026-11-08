import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SmellyInvoiceTotalsService } from './smelly';
import { InvoiceLine, InvoiceTotalsService } from './refactored';

describe('inappropriate-information', () => {
  const lines: InvoiceLine[] = [
    { quantity: 2, unitPrice: 10 },
    { quantity: 1, unitPrice: 5.5 },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  it('both versions compute the same subtotal and total', () => {
    const smelly = TestBed.inject(SmellyInvoiceTotalsService);
    const refactored = TestBed.inject(InvoiceTotalsService);
    expect(smelly.subtotal(lines)).toBe(25.5);
    expect(refactored.subtotal(lines)).toBe(25.5);
    expect(smelly.total(lines)).toBe(30.86);
    expect(refactored.total(lines)).toBe(30.86);
  });

  it('an empty invoice totals zero in both versions', () => {
    expect(TestBed.inject(SmellyInvoiceTotalsService).total([])).toBe(0);
    expect(TestBed.inject(InvoiceTotalsService).total([])).toBe(0);
  });
});
