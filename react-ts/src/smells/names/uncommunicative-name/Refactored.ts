// REFACTOR: Rename Variable / Rename Function: each name says what it represents.
export interface Payment {
  customerName: string;
  isoDate: string;
  amount: number;
}

/** Sums what was paid in a given month, formatted as "YYYY-MM". */
export function totalPaidInMonth(payments: Payment[], yearMonth: string): number {
  return payments
    .filter((payment) => payment.isoDate.startsWith(yearMonth))
    .reduce((total, payment) => total + payment.amount, 0);
}
