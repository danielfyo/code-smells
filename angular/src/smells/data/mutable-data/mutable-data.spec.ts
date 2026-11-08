import { provideZonelessChangeDetection, type Type } from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import type { Player } from './model';
import { LeaderboardSmelly } from './smelly';
import { LeaderboardRefactored } from './refactored';

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

const makePlayers = (): Player[] => [
  { name: 'Ari', points: 40 },
  { name: 'Bo', points: 55 },
  { name: 'Cy', points: 50 },
];

describe('Mutable Data', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  it('both versions render the same ranking', async () => {
    const smelly = await renderText(LeaderboardSmelly, { players: makePlayers(), bonusFor: 'Ari' });
    const refactored = await renderText(LeaderboardRefactored, { players: makePlayers(), bonusFor: 'Ari' });
    expect(refactored).toBe(smelly);
    expect(refactored).toBe('Bo (55) Ari* (50) Cy (50)');
  });

  it("the smelly component corrupts the parent's data", async () => {
    const players = makePlayers();
    await renderText(LeaderboardSmelly, { players, bonusFor: 'Ari' });
    expect(players.map((p) => p.name)).toEqual(['Bo', 'Ari*', 'Cy']);
  });

  it("the refactored component leaves the parent's data untouched", async () => {
    const players = makePlayers();
    await renderText(LeaderboardRefactored, { players, bonusFor: 'Ari' });
    expect(players).toEqual(makePlayers());
  });
});
