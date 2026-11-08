import { provideZonelessChangeDetection, type Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ShippingLabelSmelly } from './smelly';
import { ShippingLabelRefactored, isRemoteArea, type Address } from './refactored';

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

const addresses: Address[] = [
  { street: 'Calle Mayor 1', city: 'Las Palmas', postalCode: '35001', country: 'ES' },
  { street: 'Rua Augusta 10', city: 'Lisboa', postalCode: '1100-053', country: 'PT' },
];

describe('Data Clumps', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  it.each(addresses)('both versions render the same label for $city', async (address) => {
    const smelly = await renderText(ShippingLabelSmelly, { recipient: 'Iris', ...address });
    const refactored = await renderText(ShippingLabelRefactored, { recipient: 'Iris', address });
    expect(refactored).toBe(smelly);
  });

  it('detects remote areas from the whole address', () => {
    expect(isRemoteArea(addresses[0]!)).toBe(true);
    expect(isRemoteArea(addresses[1]!)).toBe(false);
  });
});
