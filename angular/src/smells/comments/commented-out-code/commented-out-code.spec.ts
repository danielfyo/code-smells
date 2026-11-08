import { provideZonelessChangeDetection, Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Product, SmellyProductListComponent } from './smelly';
import { ProductListComponent } from './refactored';

const products: Product[] = [
  { name: 'Lamp', price: 30, stock: 2 },
  { name: 'Chair', price: 1200, stock: 1 },
  { name: 'Desk', price: 250, stock: 0 },
];

describe('commented-out-code', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  it.each<Type<unknown>>([SmellyProductListComponent, ProductListComponent])(
    '%o lists the products in stock, sorted by name',
    async (component) => {
      const fixture = TestBed.createComponent(component);
      fixture.componentRef.setInput('products', products);
      await fixture.whenStable();
      const names = [...(fixture.nativeElement as HTMLElement).querySelectorAll('li')].map((li) => li.textContent);
      expect(names).toEqual(['Chair', 'Lamp']);
    },
  );
});
