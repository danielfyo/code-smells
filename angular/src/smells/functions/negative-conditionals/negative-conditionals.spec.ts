import { provideZonelessChangeDetection, type Type } from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { AccountBannerSmelly } from './smelly';
import { AccountBannerRefactored } from './refactored';

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

describe('Negative Conditionals', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  it.each([
    { verified: true, remindersEnabled: true, unpaidInvoices: 0 },
    { verified: false, remindersEnabled: true, unpaidInvoices: 2 },
    { verified: true, remindersEnabled: false, unpaidInvoices: 2 },
  ])('both versions render the same banner (%#)', async ({ verified, remindersEnabled, unpaidInvoices }) => {
    const smelly = await renderText(AccountBannerSmelly, {
      isNotVerified: !verified,
      disableReminders: !remindersEnabled,
      unpaidInvoices,
    });
    const refactored = await renderText(AccountBannerRefactored, { verified, remindersEnabled, unpaidInvoices });
    expect(refactored).toBe(smelly);
  });
});
