import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface Product {
  id: number;
  name: string;
  price: number;
}

// SMELL: multiple languages in one source file. TypeScript, an HTML template, CSS rules, a SQL
// query and an HTML e-mail fragment all live as strings in the same file. None of them gets
// syntax highlighting, linting or validation, and every change touches this one file.
@Component({
  selector: 'cs-multiple-languages-in-file-smelly',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .catalog { list-style: none; padding: 0; }
    .catalog li { display: flex; justify-content: space-between; }
    .catalog .price { font-weight: bold; }
  `,
  template: `
    <h2>{{ category() }}</h2>
    <ul class="catalog">
      @for (product of products(); track product.id) {
        <li><span>{{ product.name }}</span><span class="price">{{ product.price }} EUR</span></li>
      }
    </ul>
  `,
})
export class SmellyCatalogComponent {
  readonly category = input.required<string>();
  readonly products = input.required<Product[]>();

  // SMELL: SQL built by string concatenation inside a component (and an injection risk too).
  exportQuery(): string {
    return "SELECT id, name, price FROM products WHERE category = '" + this.category() + "' ORDER BY name";
  }

  // SMELL: HTML for an e-mail assembled in TypeScript, with inline CSS on top.
  shareEmailBody(): string {
    return (
      '<div style="font-family:sans-serif"><h1>' + this.category() + '</h1><ul>' +
      this.products().map((p) => '<li>' + p.name + ' - ' + p.price + ' EUR</li>').join('') +
      '</ul></div>'
    );
  }
}
