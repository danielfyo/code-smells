import { provideZonelessChangeDetection, type Type } from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { GuestListPagerSmelly } from './smelly';
import { GuestListPagerRefactored, paginate } from './refactored';

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

const guests = ['Ane', 'Bruno', 'Carla', 'David', 'Elsa', 'Fede', 'Gala'];

describe('Incorrect Behavior at the Boundaries', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  it('the smelly pager loses the last page and the last item of each page', async () => {
    expect(await renderText(GuestListPagerSmelly, { guests, page: 1 })).toBe('Page 1 of 2 Ane, Bruno');
  });

  it('the refactored pager shows complete pages, including the partial last one', async () => {
    expect(await renderText(GuestListPagerRefactored, { guests, page: 1 })).toBe('Page 1 of 3 Ane, Bruno, Carla');
    expect(await renderText(GuestListPagerRefactored, { guests, page: 3 })).toBe('Page 3 of 3 Gala');
  });

  it.each([
    { items: [], page: 1, expected: { page: 1, totalPages: 1, items: [] } },
    { items: ['a', 'b', 'c'], page: 1, expected: { page: 1, totalPages: 1, items: ['a', 'b', 'c'] } },
    { items: ['a', 'b', 'c', 'd'], page: 9, expected: { page: 2, totalPages: 2, items: ['d'] } },
    { items: ['a', 'b', 'c', 'd'], page: 0, expected: { page: 1, totalPages: 2, items: ['a', 'b', 'c'] } },
  ])('handles the boundary case %#', ({ items, page, expected }) => {
    expect(paginate(items, 3, page)).toEqual(expected);
  });
});
