import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { LegacyPricingService } from '../../legacy/pricing.service';

export interface Product {
  name: string;
  price: number;
  stock: number;
}

@Component({
  selector: 'cs-commented-out-code-smelly',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ul>
      @for (product of available(); track product.name) {
        <li>{{ product.name }}</li>
        <!-- <li>{{ product.name }} - {{ product.price }} (old layout, keep just in case)</li> -->
      }
    </ul>
    <!-- <button (click)="exportCsv()">Export</button> -->
  `,
})
export class SmellyProductListComponent {
  readonly products = input.required<Product[]>();

  // SMELL: commented-out code. Dead lines nobody dares to delete: are they important? a pending
  // rollback? Readers must parse them every time. Version control already remembers them.
  // private readonly http = inject(HttpClient);
  // private readonly legacy = inject(LegacyPricingService);

  readonly available = computed(() =>
    this.products()
      .filter((product) => product.stock > 0)
      // .filter((product) => product.price < 1000) // disabled 2022, CEO request?
      // .map((product) => ({ ...product, price: this.legacy.adjust(product.price) }))
      .sort((a, b) => a.name.localeCompare(b.name)),
  );

  // exportCsv(): void {
  //   const csv = this.available().map((p) => `${p.name};${p.price}`).join('\n');
  //   this.http.post('/api/export', csv).subscribe();
  // }
}
