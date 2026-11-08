import { ChangeDetectionStrategy, Component, Injectable, computed, inject, signal } from '@angular/core';

export interface OrdersPage {
  items: string[];
  totalItems: number;
}

@Injectable({ providedIn: 'root' })
export class SmellyOrdersApi {
  // The "API" decides its page size internally; the knob exists so tests can show the problem.
  pageSize = 20;
  private readonly orders = Array.from({ length: 95 }, (_, i) => `Order #${i + 1}`);

  fetchPage(page: number): OrdersPage {
    const start = (page - 1) * this.pageSize;
    return { items: this.orders.slice(start, start + this.pageSize), totalItems: this.orders.length };
  }
}

@Component({
  selector: 'cs-hidden-logical-dependency-smelly',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p class="pager">Page {{ page() }} of {{ pageCount() }} ({{ current().items.length }} orders)</p>`,
})
export class SmellyOrdersPagerComponent {
  private readonly api = inject(SmellyOrdersApi);
  readonly page = signal(1);
  readonly current = computed(() => this.api.fetchPage(this.page()));

  // SMELL: logical dependency not made physical. The pager "knows" the API returns 20 orders per
  // page, but nothing connects the two: a copied magic number. Change the API and this lies.
  readonly pageCount = computed(() => Math.ceil(this.current().totalItems / 20));
}
