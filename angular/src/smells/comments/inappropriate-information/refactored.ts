import { Injectable } from '@angular/core';

// REFACTOR: Remove Comment. Authorship, dates and tickets live in `git log` / `git blame` and in
// the issue tracker. Only comments that explain the code stay in the file.
export interface InvoiceLine {
  quantity: number;
  unitPrice: number;
}

/** Spanish standard VAT rate applied to every invoice. */
export const STANDARD_VAT_RATE = 0.21;

@Injectable({ providedIn: 'root' })
export class InvoiceTotalsService {
  subtotal(lines: readonly InvoiceLine[]): number {
    return lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0);
  }

  /** Gross total rounded to cents, as printed on the invoice. */
  total(lines: readonly InvoiceLine[]): number {
    const gross = this.subtotal(lines) * (1 + STANDARD_VAT_RATE);
    return Math.round(gross * 100) / 100;
  }
}
