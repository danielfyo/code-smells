import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { InvoiceSummaryService } from './production';

// SMELL: assertion roulette. Eight unexplained assertions, two scenarios, one vague test name.
// When it goes red the report says "expected 2 to be 3": which number? which scenario? why?
describe('InvoiceSummaryService (smelly)', () => {
  it('works', () => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    const service = TestBed.inject(InvoiceSummaryService);
    const summary = service.summarize([
      { description: 'Hosting', amount: 100 },
      { description: 'Domain', amount: 15 },
    ]);
    expect(summary.lineCount).toBe(2);
    expect(summary.subtotal).toBe(115);
    expect(summary.vat).toBe(24.15);
    expect(summary.total).toBe(139.15);
    expect(summary.largestLine).toBe('Hosting');
    const empty = service.summarize([]);
    expect(empty.lineCount).toBe(0);
    expect(empty.total).toBe(0);
    expect(empty.largestLine).toBe('');
  });
});
