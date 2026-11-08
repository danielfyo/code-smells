import type { ExpenseLine } from './model';

export interface ExpenseSummary {
  readonly total: number;
  readonly warnings: readonly string[];
}

// REFACTOR: Replace Output Argument with Return Value. The function is pure: same input, same
// output, no hidden writes, safe to call as many times as needed (e.g. inside a computed()).
export function summarizeExpenses(lines: readonly ExpenseLine[]): ExpenseSummary {
  return {
    total: lines.reduce((sum, line) => sum + line.amount, 0),
    warnings: lines.filter((line) => !line.hasReceipt).map((line) => `Missing receipt: ${line.description}`),
  };
}
