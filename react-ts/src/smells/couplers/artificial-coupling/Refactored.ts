// REFACTOR: Move Field / Extract Module. Generic constants move to their own
// modules according to their meaning. Invoices and signup depend on them, but
// no longer on each other.
// (In a real project these would be e.g. `shared/validation.ts` and `shared/pagination.ts`.)

// --- shared/validation
export const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

// --- shared/pagination
export const DEFAULT_PAGE_SIZE = 20;
export const pageCount = (total: number, size = DEFAULT_PAGE_SIZE): number => Math.ceil(total / size);

// --- invoices/InvoicePdfRenderer
export class InvoicePdfRenderer {
  render(invoiceId: string, lines: string[]): string[] {
    return Array.from({ length: pageCount(lines.length) }, (_, page) => {
      const chunk = lines.slice(page * DEFAULT_PAGE_SIZE, (page + 1) * DEFAULT_PAGE_SIZE);
      return `${invoiceId} p${page + 1}: ${chunk.length} lines`;
    });
  }
}

// --- users/signup
export const validateSignup = (email: string): boolean => EMAIL_REGEX.test(email);
export const userPages = (totalUsers: number): number => pageCount(totalUsers);
