export interface Sale {
  product: string;
  category: string;
  units: number;
  unitPrice: number;
  refunded: boolean;
}

export interface CategorySummary {
  category: string;
  revenue: number;
}

const revenueOf = (sale: Sale): number => sale.units * sale.unitPrice;

// REFACTOR: Replace Loop with Pipeline. filter → reduce (group) → sort →
// slice. Each step says WHAT it does, not HOW to walk through indices.
export function topCategories(sales: readonly Sale[], limit: number): CategorySummary[] {
  const byCategory = sales
    .filter((sale) => !sale.refunded)
    .reduce((totals, sale) => totals.set(sale.category, (totals.get(sale.category) ?? 0) + revenueOf(sale)), new Map<string, number>());

  return [...byCategory]
    .map(([category, revenue]) => ({ category, revenue }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit);
}
