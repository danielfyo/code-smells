import { provideZonelessChangeDetection, type Type } from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { ForecastPanelSmelly } from './smelly';
import { ForecastPanelRefactored } from './refactored';
import { WeatherStore } from './store';

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

describe('Middle Man', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    TestBed.inject(WeatherStore).load([
      { day: 'Mon', maxC: 18 },
      { day: 'Tue', maxC: 24 },
      { day: 'Wed', maxC: 21 },
    ]);
  });

  it('removing the middle man keeps the same output', async () => {
    const smelly = await renderText(ForecastPanelSmelly);
    const refactored = await renderText(ForecastPanelRefactored);
    expect(refactored).toBe(smelly);
    expect(refactored).toBe('3 days Warmest: Tue');
  });
});
