// REFACTOR: the header with authors, dates and tickets is removed: that information lives
// in version control (git log / git blame) and in the issue tracker.

export interface OrderLine {
  price: number;
  quantity: number;
}

/**
 * Order total after applying a percentage discount (0..1).
 * REFACTOR: the comment explains the contract and why we round, not who changed it.
 * We round to cents because that is the precision we invoice with.
 */
export function orderTotal(lines: OrderLine[], discountRate: number): number {
  const subtotal = lines.reduce((sum, line) => sum + line.price * line.quantity, 0);
  const discounted = subtotal * (1 - discountRate);
  return Math.round(discounted * 100) / 100;
}
