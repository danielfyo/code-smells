// SMELL: Artificial Coupling. Generic constants (email regex, page size, locale)
// were declared inside a concrete PDF invoice generation class. The signup form,
// which has nothing to do with invoices, now depends on `InvoicePdfRenderer`
// just to read them.
export class InvoicePdfRenderer {
  static readonly EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  static readonly PAGE_SIZE = 20;
  static readonly LOCALE = "es-ES";

  render(invoiceId: string, lines: string[]): string[] {
    const pages: string[] = [];
    for (let i = 0; i < lines.length; i += InvoicePdfRenderer.PAGE_SIZE) {
      pages.push(`${invoiceId} p${pages.length + 1}: ${lines.slice(i, i + InvoicePdfRenderer.PAGE_SIZE).length} lines`);
    }
    return pages;
  }
}

// SMELL: user signup imports the PDF renderer to validate an email and to
// paginate a list of users. Moving or deleting the PDF code breaks signup.
export function validateSignup(email: string): boolean {
  return InvoicePdfRenderer.EMAIL_REGEX.test(email);
}

export function userPages(totalUsers: number): number {
  return Math.ceil(totalUsers / InvoicePdfRenderer.PAGE_SIZE);
}
