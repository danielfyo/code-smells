import { provideZonelessChangeDetection, Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CartLine, SmellyCartFooterComponent } from './smelly';
import { CartFooterComponent, CartPricingService } from './refactored';

describe('misplaced-responsibility', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  it.each<[CartLine[], string, string]>([
    [[{ price: 10, quantity: 2 }], 'Shipping: 4.95 EUR', 'Total: 29.15 EUR'],
    [[{ price: 25, quantity: 2 }], 'Shipping: free', 'Total: 60.50 EUR'],
  ])('both footers render the same totals for %j', async (lines, shipping, total) => {
    for (const component of [SmellyCartFooterComponent, CartFooterComponent] as Type<unknown>[]) {
      const fixture = TestBed.createComponent(component);
      fixture.componentRef.setInput('lines', lines);
      await fixture.whenStable();
      const host = fixture.nativeElement as HTMLElement;
      expect(host.querySelector('.shipping')?.textContent).toBe(shipping);
      expect(host.querySelector('.total')?.textContent).toBe(total);
    }
  });

  it('refactored: the pricing rule is reusable without any component', () => {
    expect(TestBed.inject(CartPricingService).totals([{ price: 25, quantity: 2 }])).toEqual({ subtotal: 50, shipping: 0, total: 60.5 });
  });
});
