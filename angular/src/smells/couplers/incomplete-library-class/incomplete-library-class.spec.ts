import { provideZonelessChangeDetection, type Type } from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { DeliveryEtaSmelly, RefundNoticeSmelly } from './smelly';
import { DeliveryEtaRefactored, RefundNoticeRefactored, addBusinessDays } from './refactored';

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

describe('Incomplete Library Class', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  it('delivery dates match', async () => {
    const inputs = { orderedOn: '2026-07-02', businessDays: 3 }; // Thursday
    const smelly = await renderText(DeliveryEtaSmelly, inputs);
    expect(await renderText(DeliveryEtaRefactored, inputs)).toBe(smelly);
    expect(smelly).toBe('Delivery by 2026-07-07');
  });

  it('refund dates match', async () => {
    const inputs = { requestedOn: '2026-07-04' }; // Saturday
    expect(await renderText(RefundNoticeRefactored, inputs)).toBe(await renderText(RefundNoticeSmelly, inputs));
  });

  it('the extension is tested in one place', () => {
    expect(addBusinessDays('2026-07-03', 1)).toBe('2026-07-06');
  });
});
