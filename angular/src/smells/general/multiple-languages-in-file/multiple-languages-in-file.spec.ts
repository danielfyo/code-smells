import { provideZonelessChangeDetection, Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Product, SmellyCatalogComponent } from './smelly';
import { CatalogComponent } from './refactored';
import { productsByCategory } from './refactored.queries';
import { shareEmailBody } from './refactored.email';

const products: Product[] = [
  { id: 1, name: 'Kettle', price: 25 },
  { id: 2, name: 'Toaster', price: 40 },
];

describe('multiple-languages-in-file', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  it.each<Type<unknown>>([SmellyCatalogComponent, CatalogComponent])('%o renders the same catalog', async (component) => {
    const fixture = TestBed.createComponent(component);
    fixture.componentRef.setInput('category', 'Kitchen');
    fixture.componentRef.setInput('products', products);
    await fixture.whenStable();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('h2')?.textContent).toBe('Kitchen');
    expect([...host.querySelectorAll('li')].map((li) => li.textContent)).toEqual(['Kettle25 EUR', 'Toaster40 EUR']);
  });

  it('smelly SQL embeds the value (injectable); refactored SQL is parameterized', async () => {
    const fixture = TestBed.createComponent(SmellyCatalogComponent);
    fixture.componentRef.setInput('category', "x' OR '1'='1");
    fixture.componentRef.setInput('products', []);
    expect(fixture.componentInstance.exportQuery()).toContain("'x' OR '1'='1'");
    expect(productsByCategory("x' OR '1'='1")).toEqual({
      text: 'SELECT id, name, price FROM products WHERE category = $1 ORDER BY name',
      params: ["x' OR '1'='1"],
    });
  });

  it('both versions build an e-mail listing the products', () => {
    const fixture = TestBed.createComponent(SmellyCatalogComponent);
    fixture.componentRef.setInput('category', 'Kitchen');
    fixture.componentRef.setInput('products', products);
    const parse = (html: string) => {
      const box = document.createElement('div');
      box.innerHTML = html;
      return [...box.querySelectorAll('li')].map((li) => li.textContent);
    };
    expect(parse(fixture.componentInstance.shareEmailBody())).toEqual(['Kettle - 25 EUR', 'Toaster - 40 EUR']);
    expect(parse(shareEmailBody('Kitchen', products))).toEqual(['Kettle - 25 EUR', 'Toaster - 40 EUR']);
  });
});
