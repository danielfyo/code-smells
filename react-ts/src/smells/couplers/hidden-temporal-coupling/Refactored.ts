export interface Sale {
  region: string;
  amount: number;
}

export interface ReportOptions {
  currency: string;
}

// REFACTOR: Replace Temporal Coupling with Parameters (pass the result of one
// step as the input of the next). Everything needed is required by the
// signature, so it is impossible to call things "in the wrong order" or skip a step.
export function totalsByRegion(sales: readonly Sale[]): Map<string, number> {
  const totals = new Map<string, number>();
  for (const s of sales) totals.set(s.region, (totals.get(s.region) ?? 0) + s.amount);
  return totals;
}

export function buildSalesReport(sales: readonly Sale[], { currency }: ReportOptions): string[] {
  return [...totalsByRegion(sales)].map(([region, total]) => `${region}: ${total.toFixed(2)} ${currency}`);
}
