import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { Sale } from './model';

export interface CategoryTotal {
  category: string;
  total: number;
}

// REFACTOR: Replace Loop with Pipeline. filter -> reduce into a Map -> map -> sort: each step
// states what it does.
export function totalsByCategory(sales: readonly Sale[]): CategoryTotal[] {
  const totals = sales
    .filter((sale) => !sale.refunded)
    .reduce((acc, sale) => acc.set(sale.category, (acc.get(sale.category) ?? 0) + sale.amount), new Map<string, number>());
  return [...totals]
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);
}

@Component({
  selector: 'cs-loops-refactored',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (row of totals(); track row.category) {
      <p>{{ row.category }}: {{ row.total }}</p>
    }
  `,
})
export class SalesByCategoryRefactored {
  readonly sales = input<readonly Sale[]>([]);
  protected readonly totals = computed(() => totalsByCategory(this.sales()));
}
