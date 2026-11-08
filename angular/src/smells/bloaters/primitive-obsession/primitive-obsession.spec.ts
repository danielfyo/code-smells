import { provideZonelessChangeDetection, type Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { PlanPriceSmelly } from './smelly';
import { Money, Percentage, PlanPriceRefactored } from './refactored';

function textOf(host: HTMLElement): string {
  const walker = document.createTreeWalker(host, NodeFilter.SHOW_TEXT);
  const parts: string[] = [];
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = node.textContent?.replace(/\s+/g, ' ').trim();
    if (text) parts.push(text);
  }
  return parts.join(' ');
}

async function renderText(component: Type<unknown>, inputs: Record<string, unknown>): Promise<string> {
  const fixture = TestBed.createComponent(component);
  for (const [name, value] of Object.entries(inputs)) {
    fixture.componentRef.setInput(name, value);
  }
  await fixture.whenStable();
  return textOf(fixture.nativeElement as HTMLElement);
}

describe('Primitive Obsession', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  it('both versions render the same prices', async () => {
    const smelly = await renderText(PlanPriceSmelly, { priceCents: 999, currency: 'USD', discountPercent: 15 });
    const refactored = await renderText(PlanPriceRefactored, {
      monthly: Money.ofCents(999, 'USD'),
      discount: Percentage.of(15),
    });
    expect(refactored).toBe(smelly);
    expect(refactored).toBe('Monthly: 9.99 $ Yearly: 101.90 $ Save 15% yearly');
  });

  it('renders the no-discount label in both versions', async () => {
    const smelly = await renderText(PlanPriceSmelly, { priceCents: 500 });
    const refactored = await renderText(PlanPriceRefactored, { monthly: Money.ofCents(500, 'EUR') });
    expect(refactored).toBe(smelly);
  });

  it('value objects reject invalid values that primitives accept', () => {
    expect(() => Percentage.of(150)).toThrow(RangeError);
    expect(() => Money.ofCents(9.5, 'EUR')).toThrow(RangeError);
  });
});
