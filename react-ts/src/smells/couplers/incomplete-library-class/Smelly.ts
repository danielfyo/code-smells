// SMELL: Incomplete Library Class. `Date` cannot add business days or format
// as dd/mm/yyyy. Instead of extending it in a single place, every module
// re-implements its own workaround, with small differences and potential bugs.

// "shipping" module
export function estimatedDelivery(orderDate: Date, businessDays: number): string {
  const d = new Date(orderDate);
  let added = 0;
  while (added < businessDays) {
    d.setUTCDate(d.getUTCDate() + 1);
    const day = d.getUTCDay();
    if (day !== 0 && day !== 6) added++;
  }
  // SMELL: copied manual formatting.
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getUTCFullYear()}`;
}

// "billing" module (another copy of the same workaround)
export function paymentDeadline(invoiceDate: Date): string {
  const due = new Date(invoiceDate.getTime());
  let remaining = 10;
  while (remaining > 0) {
    due.setUTCDate(due.getUTCDate() + 1);
    if (due.getUTCDay() % 6 !== 0) remaining--;
  }
  return `${String(due.getUTCDate()).padStart(2, "0")}/${String(due.getUTCMonth() + 1).padStart(2, "0")}/${due.getUTCFullYear()}`;
}
