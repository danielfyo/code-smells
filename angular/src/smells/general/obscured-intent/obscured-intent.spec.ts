import { provideZonelessChangeDetection, Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Product, SmellySaleSummaryComponent } from './smelly';
import { SaleSummaryComponent } from './refactored';

async function render(component: Type<unknown>, inputName: string, products: Product[]): Promise<string[]> {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  const fixture = TestBed.createComponent(component);
  fixture.componentRef.setInput(inputName, products);
  await fixture.whenStable();
  return [...(fixture.nativeElement as HTMLElement).querySelectorAll('p')].map((p) => p.textContent ?? '');
}

describe('obscured-intent', () => {
  it.each<{ products: Product[]; expected: string[] }>([
    {
      products: [
        { name: 'Boots', price: 100, stock: 3, tags: ['sale'] },
        { name: 'Scarf', price: 20, stock: 0, tags: ['sale'] },
        { name: 'Hat', price: 30, stock: 10, tags: ['new'] },
      ],
      expected: ['1 on sale, 80.00 EUR', 'Low stock!'],
    },
    { products: [{ name: 'Hat', price: 30, stock: 10, tags: [] }], expected: ['0 on sale, 0.00 EUR', 'Stock OK'] },
  ])('both versions render $expected', async ({ products, expected }) => {
    expect(await render(SmellySaleSummaryComponent, 'p', products)).toEqual(expected);
    expect(await render(SaleSummaryComponent, 'products', products)).toEqual(expected);
  });
});
