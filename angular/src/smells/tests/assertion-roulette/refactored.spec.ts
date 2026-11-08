import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { InvoiceSummaryService } from './production';

// REFACTOR: one scenario per test with a descriptive name, and one assertion over the whole
// result: a failure prints a diff of exactly the field that is wrong. When separate assertions
// are unavoidable, give each one a message (`expect(value, 'why it matters')`).
describe('InvoiceSummaryService (refactored)', () => {
  let service: InvoiceSummaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    service = TestBed.inject(InvoiceSummaryService);
  });

  it('adds 21% VAT to the subtotal and names the largest line', () => {
    const summary = service.summarize([
      { description: 'Hosting', amount: 100 },
      { description: 'Domain', amount: 15 },
    ]);
    expect(summary).toEqual({ lineCount: 2, subtotal: 115, vat: 24.15, total: 139.15, largestLine: 'Hosting' });
  });

  it('summarizes an empty invoice as zeros', () => {
    expect(service.summarize([]), 'an empty invoice must not invent amounts').toEqual({
      lineCount: 0,
      subtotal: 0,
      vat: 0,
      total: 0,
      largestLine: '',
    });
  });
});
