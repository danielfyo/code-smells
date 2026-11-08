import { ChangeDetectionStrategy, Component, Injectable, computed, inject, signal } from '@angular/core';

// REFACTOR: Make the dependency physical. The API response carries its own page size, so the
// pager asks for it instead of assuming it; changing the API cannot desynchronize the UI.
export interface OrdersPage {
  items: string[];
  totalItems: number;
  pageSize: number;
}

@Injectable({ providedIn: 'root' })
export class OrdersApi {
  pageSize = 20;
  private readonly orders = Array.from({ length: 95 }, (_, i) => `Order #${i + 1}`);

  fetchPage(page: number): OrdersPage {
    const start = (page - 1) * this.pageSize;
    return { items: this.orders.slice(start, start + this.pageSize), totalItems: this.orders.length, pageSize: this.pageSize };
  }
}

@Component({
  selector: 'cs-hidden-logical-dependency-refactored',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p class="pager">Page {{ page() }} of {{ pageCount() }} ({{ current().items.length }} orders)</p>`,
})
export class OrdersPagerComponent {
  private readonly api = inject(OrdersApi);
  readonly page = signal(1);
  readonly current = computed(() => this.api.fetchPage(this.page()));
  readonly pageCount = computed(() => Math.ceil(this.current().totalItems / this.current().pageSize));
}
