import { Component, Input } from '@angular/core';
import type { Sale } from './model';

// SMELL: Loops. Index juggling, accumulators and a hand-written "group by" hide a simple intent:
// "valid sales, totalled per category, biggest first".
@Component({
  selector: 'cs-loops-smelly',
  template: `
    @for (row of totals(); track row.category) {
      <p>{{ row.category }}: {{ row.total }}</p>
    }
  `,
})
export class SalesByCategorySmelly {
  @Input() sales: Sale[] = [];

  totals(): { category: string; total: number }[] {
    const result: { category: string; total: number }[] = [];
    for (let i = 0; i < this.sales.length; i++) {
      const sale = this.sales[i]!;
      if (sale.refunded) {
        continue;
      }
      let existing: { category: string; total: number } | undefined;
      for (let j = 0; j < result.length; j++) {
        if (result[j]!.category === sale.category) {
          existing = result[j];
          break;
        }
      }
      if (existing) {
        existing.total += sale.amount;
      } else {
        result.push({ category: sale.category, total: sale.amount });
      }
    }
    for (let i = 0; i < result.length; i++) {
      for (let j = i + 1; j < result.length; j++) {
        if (result[j]!.total > result[i]!.total) {
          const tmp = result[i]!;
          result[i] = result[j]!;
          result[j] = tmp;
        }
      }
    }
    return result;
  }
}
