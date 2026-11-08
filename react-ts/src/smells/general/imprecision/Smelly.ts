// SMELL: imprecision. Floating-point numbers are used for money and compared with ===.
// It also assumes a search returns exactly one result ([0]) without checking.
export interface Invoice {
  customerEmail: string;
  lines: number[]; // amounts in euros as floats
}

export function invoiceTotal(invoice: Invoice): number {
  return invoice.lines.reduce((sum, amount) => sum + amount, 0);
}

export function isFullyPaid(invoice: Invoice, paid: number): boolean {
  return invoiceTotal(invoice) === paid; // SMELL: 0.1 + 0.2 !== 0.3
}

export function findInvoiceByEmail(invoices: Invoice[], email: string): Invoice {
  return invoices.filter((i) => i.customerEmail === email)[0]; // SMELL: what if there are 0 or 2?
}
