import { provideZonelessChangeDetection, type Type } from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { NewsletterSignupSmelly } from './smelly';
import { NewsletterSignupRefactored } from './refactored';

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

async function clickTwice(component: Type<unknown>): Promise<string[]> {
  const fixture = TestBed.createComponent(component);
  fixture.componentRef.setInput('topic', 'Gardening');
  await fixture.whenStable();
  const texts = [textOf(fixture)];
  for (let i = 0; i < 2; i++) {
    (fixture.nativeElement as HTMLElement).querySelector('button')?.click();
    await fixture.whenStable();
    texts.push(textOf(fixture));
  }
  return texts;
}

describe('Clutter', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  it('removing the clutter keeps the same behavior', async () => {
    const smelly = await clickTwice(NewsletterSignupSmelly);
    const refactored = await clickTwice(NewsletterSignupRefactored);
    expect(refactored).toEqual(smelly);
    expect(refactored.at(-1)).toBe('Subscribed to Gardening (1) Subscribe');
  });
});
