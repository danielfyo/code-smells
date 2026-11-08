import { provideZonelessChangeDetection, type Type } from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { AppointmentListSmelly, InvoiceListSmelly } from './smelly';
import { AppointmentListRefactored, InvoiceListRefactored, relativeDay } from './refactored';

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

const today = '2026-05-10';

describe('Duplicate Code', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  it('appointment lists match', async () => {
    const inputs = {
      today,
      appointments: [
        { title: 'Dentist', date: '2026-05-13' },
        { title: 'Haircut', date: '2026-05-10' },
      ],
    };
    const smelly = await renderText(AppointmentListSmelly, inputs);
    expect(await renderText(AppointmentListRefactored, inputs)).toBe(smelly);
    expect(smelly).toBe('Dentist: in 3 days Haircut: today');
  });

  it('invoice lists match', async () => {
    const inputs = { today, invoices: [{ number: 7, dueDate: '2026-05-08' }] };
    expect(await renderText(InvoiceListRefactored, inputs)).toBe(await renderText(InvoiceListSmelly, inputs));
  });

  it('the shared function is tested once', () => {
    expect(relativeDay('2026-05-01', today)).toBe('9 days ago');
  });
});
