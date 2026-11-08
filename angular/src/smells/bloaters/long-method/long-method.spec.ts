import { provideZonelessChangeDetection, type Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FreelanceInvoiceSmelly } from './smelly';
import type { TimeEntry } from './model';
import { FreelanceInvoiceRefactored, grossFee, volumeDiscount } from './refactored';

async function renderLines(component: Type<unknown>, inputs: Record<string, unknown>): Promise<string[]> {
  const fixture = TestBed.createComponent(component);
  for (const [name, value] of Object.entries(inputs)) {
    fixture.componentRef.setInput(name, value);
  }
  await fixture.whenStable();
  const host = fixture.nativeElement as HTMLElement;
  return Array.from(host.querySelectorAll('p'), (p) => p.textContent?.trim() ?? '');
}

const entries: TimeEntry[] = [
  { task: 'Design', hours: 30, billable: true },
  { task: 'Meetings', hours: 4, billable: false },
  { task: 'Development', hours: 12.5, billable: true },
];

describe('Long Method', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  it.each([
    { entries, hourlyRate: 50, rush: false },
    { entries, hourlyRate: 40, rush: true },
    { entries: entries.slice(0, 2), hourlyRate: 60, rush: false },
  ])('both versions render the same invoice (%#)', async (inputs) => {
    const smelly = await renderLines(FreelanceInvoiceSmelly, inputs);
    const refactored = await renderLines(FreelanceInvoiceRefactored, inputs);
    expect(refactored).toEqual(smelly);
  });

  it('computes the amount to pay', async () => {
    const lines = await renderLines(FreelanceInvoiceRefactored, { entries, hourlyRate: 50, rush: false });
    // 42.5 h * 50 = 2125, -5% = 2018.75, -15% withholding = 1715.94
    expect(lines.at(-1)).toBe('To pay: 1715.94');
  });

  it('the extracted rules can be tested on their own', () => {
    expect(grossFee(10, 20, true)).toBe(250);
    expect(volumeDiscount(40, 1000)).toBe(0);
    expect(volumeDiscount(41, 1000)).toBe(50);
  });
});
