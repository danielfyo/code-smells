import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface Product {
  id: number;
  name: string;
  price: number;
}

// REFACTOR: Separate languages into their own files. The template is refactored.html, the styles
// refactored.css, the SQL refactored.queries.ts and the e-mail markup refactored.email.ts.
// Each file gets the right tooling (template type-checking, CSS linting, SQL review).
@Component({
  selector: 'cs-multiple-languages-in-file-refactored',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './refactored.html',
  styleUrl: './refactored.css',
})
export class CatalogComponent {
  readonly category = input.required<string>();
  readonly products = input.required<Product[]>();
}
