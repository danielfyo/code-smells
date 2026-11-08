import { provideZonelessChangeDetection, type Type } from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { CartBadgeSmelly, shopSession } from './smelly';
import { CartBadgeRefactored } from './refactored';

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

async function addOnce(component: Type<unknown>): Promise<string> {
  const fixture = TestBed.createComponent(component);
  await fixture.whenStable();
  (fixture.nativeElement as HTMLElement).querySelector('button')?.click();
  await fixture.whenStable();
  return textOf(fixture);
}

describe('Global Data', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  it('both versions render the same badge after one click', async () => {
    shopSession.cartCount = 0;
    expect(await addOnce(CartBadgeRefactored)).toBe(await addOnce(CartBadgeSmelly));
  });

  it('smelly global state survives a brand-new TestBed', async () => {
    shopSession.cartCount = 0;
    await addOnce(CartBadgeSmelly);
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    expect(await addOnce(CartBadgeSmelly)).toBe('guest: 2 items Add to cart');
  });

  it('refactored state starts fresh with every injector', async () => {
    await addOnce(CartBadgeRefactored);
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    expect(await addOnce(CartBadgeRefactored)).toBe('guest: 1 items Add to cart');
  });
});
