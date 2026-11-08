import { ChangeDetectionStrategy, Component, Signal, computed, signal } from '@angular/core';

// REFACTOR: Replace Inheritance with Composition. Paging is a small reusable unit built from
// signals; each component creates what it needs and keeps its own lifecycle. Behaviors can be
// combined freely and nothing depends on remembering to call super.
export interface Pagination<T> {
  readonly page: Signal<number>;
  readonly pageCount: Signal<number>;
  readonly visible: Signal<readonly T[]>;
  next(): void;
}

export function createPagination<T>(items: Signal<readonly T[]>, pageSize: number): Pagination<T> {
  const page = signal(1);
  const pageCount = computed(() => Math.max(1, Math.ceil(items().length / pageSize)));
  return {
    page: page.asReadonly(),
    pageCount,
    visible: computed(() => items().slice((page() - 1) * pageSize, page() * pageSize)),
    next: () => page.update((current) => Math.min(current + 1, pageCount())),
  };
}

@Component({
  selector: 'cs-component-inheritance-paged-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ul>
      @for (name of pagination.visible(); track name) {
        <li>{{ name }}</li>
      }
    </ul>
    <button type="button" class="next" (click)="pagination.next()">Next</button>
    <span class="page">{{ pagination.page() }}/{{ pagination.pageCount() }}</span>
  `,
})
export class CustomerListComponent {
  private readonly customers = signal<readonly string[]>(['Ana', 'Leo', 'Eva']);
  protected readonly pagination = createPagination(this.customers, 2);
}

@Component({
  selector: 'cs-component-inheritance-supplier-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ul>
      @for (name of pagination.visible(); track name) {
        <li>{{ name }}</li>
      }
    </ul>
    <button type="button" class="next" (click)="pagination.next()">Next</button>
    <span class="page">{{ pagination.page() }}/{{ pagination.pageCount() }}</span>
  `,
})
export class SupplierListComponent {
  private readonly suppliers = signal<readonly string[]>(['Acme', 'Globex', 'Initech']);
  protected readonly pagination = createPagination(this.suppliers, 2);
}
