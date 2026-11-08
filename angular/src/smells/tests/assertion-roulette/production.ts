import { Injectable } from '@angular/core';

// Production code: summarizes the lines of an invoice.
export interface InvoiceLine {
  description: string;
  amount: number;
}

export interface InvoiceSummary {
  lineCount: number;
  subtotal: number;
  vat: number;
  total: number;
  largestLine: string;
}

@Injectable({ providedIn: 'root' })
export class InvoiceSummaryService {
  summarize(lines: readonly InvoiceLine[]): InvoiceSummary {
    const subtotal = lines.reduce((sum, line) => sum + line.amount, 0);
    const vat = Math.round(subtotal * 21) / 100;
    const largest = lines.reduce<InvoiceLine | undefined>((max, line) => (!max || line.amount > max.amount ? line : max), undefined);
    return { lineCount: lines.length, subtotal, vat, total: subtotal + vat, largestLine: largest?.description ?? '' };
  }
}
