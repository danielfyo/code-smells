import { provideZonelessChangeDetection, type Type } from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { RecipeScalerSmelly } from './smelly';
import { RecipeScalerRefactored } from './refactored';

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

describe('Dead Code', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  it('removing the dead code does not change what is rendered', async () => {
    const inputs = {
      ingredients: [
        { name: 'Flour', grams: 500 },
        { name: 'Sugar', grams: 125 },
      ],
      baseServings: 4,
      servings: 6,
    };
    const smelly = await renderText(RecipeScalerSmelly, inputs);
    const refactored = await renderText(RecipeScalerRefactored, inputs);
    expect(refactored).toBe(smelly);
    expect(refactored).toBe('Flour: 750 g Sugar: 188 g');
  });
});
