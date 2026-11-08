// REFACTOR: Replace Primitive with Object. `Money` and `Email` encapsulate
// their invariants; once built, the rest of the code can trust them.

export class Money {
  private constructor(
    readonly cents: number,
    readonly currency: string,
  ) {}

  static of(amount: number, currency: string): Money {
    if (currency.length !== 3) throw new Error("Invalid currency");
    return new Money(Math.round(amount * 100), currency.toUpperCase());
  }

  // REFACTOR: splitting without losing cents is behaviour of the value itself.
  allocate(parts: number): Money[] {
    const base = Math.floor(this.cents / parts);
    const remainder = this.cents - base * parts;
    return Array.from({ length: parts }, (_, i) => new Money(base + (i < remainder ? 1 : 0), this.currency));
  }

  toString(): string {
    return `${(this.cents / 100).toFixed(2)} ${this.currency}`;
  }
}

// REFACTOR: branded type: only `parseEmail` can create an Email.
export type Email = string & { readonly __brand: "Email" };

export function parseEmail(raw: string): Email {
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(raw)) throw new Error(`Invalid email: ${raw}`);
  return raw.toLowerCase() as Email;
}

export function splitBill(total: number, currency: string, emails: string[]): string[] {
  if (emails.length === 0) throw new Error("No participants");
  const money = Money.of(total, currency);
  const people = emails.map(parseEmail);
  const shares = money.allocate(people.length);
  return people.map((email, i) => `${email}: ${shares[i]}`);
}
