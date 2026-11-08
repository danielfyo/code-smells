import type { ExpenseLine } from './model';
import { addExpenses, type ExpenseReportSmelly } from './smelly';
import { summarizeExpenses } from './refactored';

const lines: ExpenseLine[] = [
  { description: 'Train', amount: 54.2, hasReceipt: true },
  { description: 'Taxi', amount: 18, hasReceipt: false },
];

describe('Output Arguments', () => {
  it('both versions produce the same totals and warnings', () => {
    const report: ExpenseReportSmelly = { employee: 'Iker', total: 0, warnings: [] };
    addExpenses(report, lines);
    const summary = summarizeExpenses(lines);
    expect(summary).toEqual({ total: report.total, warnings: report.warnings });
  });

  it('calling the smelly function twice corrupts the report', () => {
    const report: ExpenseReportSmelly = { employee: 'Iker', total: 0, warnings: [] };
    addExpenses(report, lines);
    addExpenses(report, lines);
    expect(report.total).toBeCloseTo(144.4);
    expect(report.warnings).toHaveLength(2);
  });

  it('the refactored function is idempotent', () => {
    expect(summarizeExpenses(lines)).toEqual(summarizeExpenses(lines));
  });
});
