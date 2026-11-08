// REFACTOR: money is represented as integer cents (no rounding error) and the search
// explicitly handles the zero-or-many results cases.
export type Cents = number;

export interface Invoice {
  customerEmail: string;
  lines: Cents[];
}

export function toCents(euros: number): Cents {
  return Math.round(euros * 100);
}

export function invoiceTotal(invoice: Invoice): Cents {
  return invoice.lines.reduce((sum, amount) => sum + amount, 0);
}

export function isFullyPaid(invoice: Invoice, paid: Cents): boolean {
  return invoiceTotal(invoice) === paid;
}

export function findInvoiceByEmail(invoices: Invoice[], email: string): Invoice | undefined {
  const matches = invoices.filter((invoice) => invoice.customerEmail === email);
  if (matches.length > 1) throw new Error(`Found ${matches.length} invoices for ${email}`);
  return matches[0];
}
