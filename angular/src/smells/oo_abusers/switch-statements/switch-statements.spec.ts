import { provideZonelessChangeDetection, type Type } from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import type { OutgoingMessage } from './model';
import { OutboxSmelly } from './smelly';
import { CHANNEL_POLICIES, OutboxRefactored } from './refactored';

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

const messages: OutgoingMessage[] = [
  { channel: 'email', recipient: 'ana@shop.test', length: 900 },
  { channel: 'sms', recipient: '+34600000000', length: 200 },
  { channel: 'push', recipient: 'device-42', length: 150 },
];

describe('Switch Statements', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  it('both versions render the same outbox', async () => {
    const smelly = await renderText(OutboxSmelly, { messages });
    const refactored = await renderText(OutboxRefactored, { messages });
    expect(refactored).toBe(smelly);
    expect(refactored).toContain('SMS to +34600000000: 0.100 €');
    expect(refactored).toContain('Push to device-42: 0.000 € (too long)');
  });

  it('each policy is a self-contained object', () => {
    expect(CHANNEL_POLICIES.sms.cost(161)).toBeCloseTo(0.1);
    expect(CHANNEL_POLICIES.email.maxLength).toBe(100_000);
  });
});
