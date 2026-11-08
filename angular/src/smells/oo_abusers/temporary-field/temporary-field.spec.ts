import { provideZonelessChangeDetection, type Type } from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { DeliveryRouteSmelly } from './smelly';
import { DeliveryRouteRefactored, planRoute } from './refactored';

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

describe('Temporary Field', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  it('both versions render the same route summary', async () => {
    const inputs = { stopDistancesKm: [12, 0, 7.5, 20] };
    const smelly = await renderText(DeliveryRouteSmelly, inputs);
    const refactored = await renderText(DeliveryRouteRefactored, inputs);
    expect(refactored).toBe(smelly);
    expect(refactored).toBe('3 legs, 39.5 km, average 13.2 km, longest 20 km');
  });

  it('the smelly temporary fields are meaningless outside summary()', () => {
    const route = TestBed.createComponent(DeliveryRouteSmelly).componentInstance;
    expect(route.averageLeg()).toBeNaN();
  });

  it('the refactored plan is always complete, even for an empty route', () => {
    expect(planRoute([])).toEqual({ legs: 0, totalKm: 0, averageKm: 0, longestKm: 0 });
  });
});
