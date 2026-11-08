import { provideZonelessChangeDetection, type Type } from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { GymMembershipSmelly, MembershipCardSmelly } from './smelly';
import { GymMembership, MembershipCardRefactored } from './refactored';

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

async function renewAndRead(component: Type<unknown>, inputs: Record<string, unknown>): Promise<string[]> {
  const fixture = TestBed.createComponent(component);
  for (const [name, value] of Object.entries(inputs)) {
    fixture.componentRef.setInput(name, value);
  }
  await fixture.whenStable();
  const before = textOf(fixture);
  (fixture.nativeElement as HTMLElement).querySelector('button')?.click();
  await fixture.whenStable();
  return [before, textOf(fixture)];
}

describe('Data Class', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  it('both versions show the same status before and after renewing', async () => {
    const legacy = new GymMembershipSmelly();
    legacy.setMember('Rosa');
    legacy.setExpiresOn('2026-01-05');
    const smelly = await renewAndRead(MembershipCardSmelly, { membership: legacy, today: '2026-01-10' });
    const refactored = await renewAndRead(MembershipCardRefactored, {
      membership: new GymMembership('Rosa', '2026-01-05'),
      today: '2026-01-10',
    });
    expect(refactored).toEqual(smelly);
    expect(refactored).toEqual(['Rosa: expired Renew', 'Rosa: 26 days left Renew']);
  });

  it('the rules travel with the data', () => {
    expect(new GymMembership('Rosa', '2026-01-31').renewedForOneMonth().expiresOn).toBe('2026-03-03');
  });
});
