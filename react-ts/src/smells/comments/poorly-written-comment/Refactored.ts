export interface Invoice {
  amount: number;
  daysOverdue: number;
}

const DAILY_LATE_FEE_RATE = 0.01;
const MIN_AMOUNT_FOR_LATE_FEE = 50;
const MAX_LATE_FEE = 100;

/**
 * Late-payment fee for an invoice.
 * REFACTOR: a short, precise, well-written comment that explains the business rule:
 * - 1% of the amount is charged for every day overdue.
 * - Invoices under €50 are exempt (not worth processing).
 * - The fee has a legal cap of €100.
 */
export function lateFee(invoice: Invoice): number {
  if (invoice.daysOverdue <= 0 || invoice.amount < MIN_AMOUNT_FOR_LATE_FEE) return 0;
  const fee = invoice.amount * DAILY_LATE_FEE_RATE * invoice.daysOverdue;
  return Math.min(fee, MAX_LATE_FEE);
}
