import { provideZonelessChangeDetection, type Type } from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { CarRowSmelly, FlightRowSmelly, HotelRowSmelly } from './smelly';
import { CarRowRefactored, FlightRowRefactored, HotelRowRefactored, grossPrice } from './refactored';

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

describe('Shotgun Surgery', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  it('flight rows match', async () => {
    const inputs = { booking: { route: 'MAD-LIS', netCents: 8900 } };
    expect(await renderText(FlightRowRefactored, inputs)).toBe(await renderText(FlightRowSmelly, inputs));
  });

  it('hotel rows match', async () => {
    const inputs = { booking: { hotel: 'Sea View', nights: 3, nightlyNetCents: 7450 } };
    expect(await renderText(HotelRowRefactored, inputs)).toBe(await renderText(HotelRowSmelly, inputs));
  });

  it('car rows match', async () => {
    const inputs = { data: { model: 'Clio', days: 4, dailyNetCents: 3300 } };
    expect(await renderText(CarRowRefactored, inputs)).toBe(await renderText(CarRowSmelly, inputs));
  });

  it('the pricing rule has a single home', () => {
    expect(grossPrice(10000)).toBe('121.00 €');
  });
});
