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

// SMELL: Loops. Three manual loops with indices, accumulators and helper arrays
// for something that is just "filter, group, sort and keep N". The intent gets
// lost in the scaffolding.
export function topCategories(sales: Sale[], limit: number): CategorySummary[] {
  const valid: Sale[] = [];
  for (let i = 0; i < sales.length; i++) {
    if (!sales[i].refunded) valid.push(sales[i]);
  }

  const totals: CategorySummary[] = [];
  for (let i = 0; i < valid.length; i++) {
    let existing: CategorySummary | undefined;
    for (let j = 0; j < totals.length; j++) {
      if (totals[j].category === valid[i].category) existing = totals[j];
    }
    if (existing) existing.revenue += valid[i].units * valid[i].unitPrice;
    else totals.push({ category: valid[i].category, revenue: valid[i].units * valid[i].unitPrice });
  }

  totals.sort((a, b) => b.revenue - a.revenue);
  const result: CategorySummary[] = [];
  for (let i = 0; i < totals.length && i < limit; i++) result.push(totals[i]);
  return result;
}
