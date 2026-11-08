import { provideZonelessChangeDetection, Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { OrderSummary, SmellyOrderSummaryComponent } from './smelly';
import { OrderSummaryComponent } from './refactored';

async function labels(component: Type<unknown>, order: OrderSummary): Promise<string[]> {
  const fixture = TestBed.createComponent(component);
  fixture.componentRef.setInput('order', order);
  await fixture.whenStable();
  return [...(fixture.nativeElement as HTMLElement).querySelectorAll('p')].map((p) => p.textContent ?? '');
}

describe('oddball-solution', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  it('both versions agree on simple amounts', async () => {
    const order = { subtotal: 42.5, shipping: 4.95, discount: 5 };
    expect(await labels(SmellyOrderSummaryComponent, order)).toEqual(['42,50 €', '4,95 €', '5,00 €']);
    expect(await labels(OrderSummaryComponent, order)).toEqual(['42,50 €', '4,95 €', '5,00 €']);
  });

  it('smelly: the hand-made formatter truncates where the others round', async () => {
    const order = { subtotal: 2.999, shipping: 2.999, discount: 2.999 };
    expect(await labels(SmellyOrderSummaryComponent, order)).toEqual(['3,00\u00a0€', '3,00\u00a0€', '2,99\u00a0€']);
    expect(await labels(OrderSummaryComponent, order)).toEqual(['3,00\u00a0€', '3,00\u00a0€', '3,00\u00a0€']);
  });
});
