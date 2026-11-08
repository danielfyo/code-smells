import { provideZonelessChangeDetection, type Type } from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { CustomerListSmelly, InvoiceTableSmelly } from './smelly';
import { CustomerListRefactored, InvoiceTableRefactored } from './refactored';

function textOf(fixture: ComponentFixture<unknown>): string {
  const walker = document.createTreeWalker(fixture.nativeElement as HTMLElement, NodeFilter.SHOW_TEXT);
  const parts: string[] = [];
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = node.textContent?.replace(/\s+/g, ' ').trim();
    if (text) parts.push(text);
  }
  return parts.join(' ');
}

async function renderText(component: Type<unknown>, inputs: Record<string, unknown> = {}): Promise<string> {
  const fixture = TestBed.createComponent(component);
  for (const [name, value] of Object.entries(inputs)) {
    fixture.componentRef.setInput(name, value);
  }
  await fixture.whenStable();
  return textOf(fixture);
}

describe('Artificial Coupling', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  it('invoice pages match', async () => {
    const inputs = { invoices: ['F-1', 'F-2', 'F-3', 'F-4'], page: 2 };
    expect(await renderText(InvoiceTableRefactored, inputs)).toBe(await renderText(InvoiceTableSmelly, inputs));
  });

  it('customer pages match', async () => {
    const inputs = { customers: ['Ana', 'Bea', 'Cris', 'Dani'] };
    const smelly = await renderText(CustomerListSmelly, inputs);
    expect(await renderText(CustomerListRefactored, inputs)).toBe(smelly);
    expect(smelly).toBe('Customers: Ana, Bea, Cris');
  });
});
