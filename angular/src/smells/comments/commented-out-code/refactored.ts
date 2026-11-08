import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface Product {
  name: string;
  price: number;
  stock: number;
}

// REFACTOR: Remove Dead Code. The commented-out imports, filters, template fragments and the old
// export method are deleted; git history keeps them if anyone ever needs them back.
@Component({
  selector: 'cs-commented-out-code-refactored',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ul>
      @for (product of available(); track product.name) {
        <li>{{ product.name }}</li>
      }
    </ul>
  `,
})
export class ProductListComponent {
  readonly products = input.required<Product[]>();

  readonly available = computed(() =>
    this.products()
      .filter((product) => product.stock > 0)
      .sort((a, b) => a.name.localeCompare(b.name)),
  );
}
