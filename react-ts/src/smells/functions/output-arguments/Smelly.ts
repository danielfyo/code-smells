export interface Contact {
  name: string;
  email: string;
  age: number;
}

// SMELL: Output Arguments. The function "returns" its results by writing into
// the `target` and `errors` arguments. Reading `parseContact(line, c, errs)` you
// cannot tell what is read and what is written, and the caller has to prepare
// empty objects beforehand.
export function parseContact(line: string, target: Contact, errors: string[]): void {
  const [name = "", email = "", age = ""] = line.split(";").map((s) => s.trim());
  target.name = name;
  target.email = email.toLowerCase();
  target.age = Number(age);
  if (!name) errors.push("empty name");
  if (!email.includes("@")) errors.push(`invalid email: ${email}`);
  if (!Number.isInteger(target.age) || target.age < 0) errors.push(`invalid age: ${age}`);
}

export function importContacts(csv: string): { contacts: Contact[]; errors: string[] } {
  const contacts: Contact[] = [];
  const errors: string[] = [];
  for (const line of csv.split("\n").filter(Boolean)) {
    const contact: Contact = { name: "", email: "", age: 0 };
    const lineErrors: string[] = [];
    parseContact(line, contact, lineErrors);
    if (lineErrors.length === 0) contacts.push(contact);
    errors.push(...lineErrors);
  }
  return { contacts, errors };
}
