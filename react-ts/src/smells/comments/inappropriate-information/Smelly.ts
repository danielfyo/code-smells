// SMELL: Inappropriate information. The comments store metadata that belongs in version
// control or the issue tracker (author, dates, change history, JIRA tickets).

/*
 * Author: John Smith
 * Created: 2019-03-12
 * Modified: 2021-07-04 by Anna (ticket SHOP-1234)
 * Modified: 2023-01-18 by Luke (ticket SHOP-2201, "fix rounding")
 * Reviewed by: the payments team
 */
// SMELL: this header block is a hand-written changelog: git log already knows all this,
// and it goes stale the moment someone forgets to fill it in.

export interface OrderLine {
  price: number;
  quantity: number;
}

// SMELL: points to a ticket and a private conversation instead of explaining the "why".
// See SHOP-2201 and the Slack thread from 01/18 with Marketing.
export function orderTotal(lines: OrderLine[], discountRate: number): number {
  const subtotal = lines.reduce((sum, line) => sum + line.price * line.quantity, 0);
  // SMELL: "Changed by Luke 2023-01-18": authorship data, not design information.
  const discounted = subtotal * (1 - discountRate);
  return Math.round(discounted * 100) / 100;
}
