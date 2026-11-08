import { provideZonelessChangeDetection, type Type } from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { PlaylistPanelSmelly, PlaylistSmelly } from './smelly';
import { Playlist, PlaylistPanelRefactored } from './refactored';

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

async function clickAdd(component: Type<unknown>, times: number): Promise<string> {
  const fixture = TestBed.createComponent(component);
  await fixture.whenStable();
  for (let i = 0; i < times; i++) {
    (fixture.nativeElement as HTMLElement).querySelector('button')?.click();
    await fixture.whenStable();
  }
  return textOf(fixture);
}

describe('Inappropriate Intimacy', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  it('both versions show the same playlist after adding tracks', async () => {
    const smelly = await clickAdd(PlaylistPanelSmelly, 2);
    const refactored = await clickAdd(PlaylistPanelRefactored, 2);
    expect(refactored).toBe(smelly);
    expect(refactored).toContain('2 tracks, 3:10');
  });

  it('another intimate client can corrupt the smelly service', () => {
    const playlist = TestBed.inject(PlaylistSmelly);
    playlist.tracks.push({ title: 'Outro', seconds: 60 }); // forgot the cache
    expect(playlist._totalSeconds).toBe(0);
  });

  it('the refactored service keeps its invariant', () => {
    const playlist = TestBed.inject(Playlist);
    playlist.add({ title: 'Outro', seconds: 60 });
    expect(playlist.totalSeconds()).toBe(60);
  });
});
