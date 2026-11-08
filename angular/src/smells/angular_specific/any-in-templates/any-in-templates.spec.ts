import { provideZonelessChangeDetection, Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SmellyOrderCardComponent } from './smelly';
import { Order, OrderCardComponent } from './refactored';

const order: Order = {
  customer: { name: 'Ana', address: { street: 'Gran Via 1', city: 'Madrid' } },
  total: 42.5,
  lines: [
    { sku: 'MUG', quantity: 2 },
    { sku: 'TEE', quantity: 1 },
  ],
};

async function render(component: Type<unknown>): Promise<string[]> {
  TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  const fixture = TestBed.createComponent(component);
  fixture.componentRef.setInput('order', order);
  await fixture.whenStable();
  return [...(fixture.nativeElement as HTMLElement).querySelectorAll('p')].map((p) => p.textContent ?? '');
}

describe('any-in-templates', () => {
  it('smelly: typos hidden by any/$any compile and render blanks', async () => {
    expect(await render(SmellyOrderCardComponent)).toEqual(['Ana ()', ' EUR', ' lines']);
  });

  it('refactored: typed bindings render the real data', async () => {
    expect(await render(OrderCardComponent)).toEqual(['Ana (Madrid)', '42.50 EUR', '2 lines']);
  });
});
