export interface Invoice {
  amount: number;
  daysOverdue: number;
}

// SMELL: poorly written comment: it rambles, has typos and doesn't explain the business rule.
// this does the surcharge thing they told us about lets see if it works,, careful cuz
// sometimes it doesnt apply (when its small i think?) and theres that cap i dont remember
// where it came from but it works DONT TOUCH!!!
export function lateFee(invoice: Invoice): number {
  // SMELL: "the thing from before" means nothing to the reader.
  // here the thing from before but with the days
  if (invoice.daysOverdue <= 0 || invoice.amount < 50) return 0;
  const fee = invoice.amount * 0.01 * invoice.daysOverdue;
  // SMELL: "that cap": a vague comment that forces the reader to guess.
  return Math.min(fee, 100); // that cap
}
