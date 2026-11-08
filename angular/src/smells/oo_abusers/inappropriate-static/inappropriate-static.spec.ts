import { provideZonelessChangeDetection, type Type } from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { MuseumTicketSmelly, SystemClockSmelly } from './smelly';
import { CLOCK, MuseumTicketRefactored } from './refactored';

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

const saturday = new Date(2026, 2, 7, 10);
const tuesday = new Date(2026, 2, 3, 10);

describe('Inappropriate Static', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each([saturday, tuesday])('both versions price the ticket the same on %s', async (date) => {
    // Smelly: the only way in is to patch the static method globally.
    vi.spyOn(SystemClockSmelly, 'now').mockReturnValue(date);
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), { provide: CLOCK, useValue: () => date }],
    });
    const smelly = await renderText(MuseumTicketSmelly, { baseCents: 1500 });
    const refactored = await renderText(MuseumTicketRefactored, { baseCents: 1500 });
    expect(refactored).toBe(smelly);
  });

  it('the refactored clock is replaced through DI only', async () => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), { provide: CLOCK, useValue: () => saturday }],
    });
    expect(await renderText(MuseumTicketRefactored, { baseCents: 1500 })).toBe('Ticket: 18.00 €');
  });
});
