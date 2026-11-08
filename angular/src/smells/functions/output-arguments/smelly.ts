import type { ExpenseLine } from './model';

export interface ExpenseReportSmelly {
  employee: string;
  total: number;
  warnings: string[];
}

// SMELL: Output Arguments. The function "returns" its results by writing into `report`.
// Callers must create an empty report first, and calling it twice doubles the total.
export function addExpenses(report: ExpenseReportSmelly, lines: readonly ExpenseLine[]): void {
  for (const line of lines) {
    report.total += line.amount;
    if (!line.hasReceipt) {
      report.warnings.push(`Missing receipt: ${line.description}`);
    }
  }
}
