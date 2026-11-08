// SMELL: Primitive Obsession. Money is a bare `number` paired with a currency
// `string`, and emails are unvalidated `string`s. The rules (rounding to cents,
// formatting, validation) are repeated wherever they are used.
export function splitBill(total: number, currency: string, emails: string[]): string[] {
  if (emails.length === 0) throw new Error("No participants");
  if (currency.length !== 3) throw new Error("Invalid currency");

  // SMELL: floating-point arithmetic and manual conversion to cents.
  const totalCents = Math.round(total * 100);
  const base = Math.floor(totalCents / emails.length);
  let remainder = totalCents - base * emails.length;

  const result: string[] = [];
  for (const email of emails) {
    // SMELL: ad hoc copy of email validation; nothing prevents passing any string.
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Error(`Invalid email: ${email}`);
    let cents = base;
    if (remainder > 0) {
      cents += 1;
      remainder -= 1;
    }
    // SMELL: the amount format is hand-built from the primitive.
    result.push(`${email.toLowerCase()}: ${(cents / 100).toFixed(2)} ${currency.toUpperCase()}`);
  }
  return result;
}
