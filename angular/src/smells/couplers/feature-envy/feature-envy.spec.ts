import { provideZonelessChangeDetection, type Type } from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { ShippingQuoteSmelly, type ParcelData } from './smelly';
import { Parcel, ShippingQuoteRefactored } from './refactored';

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

describe('Feature Envy', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  it.each<ParcelData>([
    { weightKg: 2, lengthCm: 40, widthCm: 30, heightCm: 20, fragile: true },
    { weightKg: 9, lengthCm: 20, widthCm: 20, heightCm: 10, fragile: false },
  ])('both versions quote the same price (%#)', async (data) => {
    const parcel = new Parcel(data.weightKg, data.lengthCm, data.widthCm, data.heightCm, data.fragile);
    const smelly = await renderText(ShippingQuoteSmelly, { parcel: data, ratePerKg: 1.5 });
    const refactored = await renderText(ShippingQuoteRefactored, { parcel, ratePerKg: 1.5 });
    expect(refactored).toBe(smelly);
  });

  it('the parcel answers questions about itself', () => {
    expect(new Parcel(2, 40, 30, 20, false).billableWeightKg()).toBe(4.8);
  });
});
