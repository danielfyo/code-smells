export interface Contact {
  name: string;
  email: string;
  age: number;
}

// REFACTOR: Replace Output Argument with Return Value. The function takes only
// inputs and returns an explicit result (an ok/error discriminated union).
export type ParseResult = { ok: true; contact: Contact } | { ok: false; errors: string[] };

export function parseContact(line: string): ParseResult {
  const [name = "", rawEmail = "", rawAge = ""] = line.split(";").map((s) => s.trim());
  const age = Number(rawAge);
  const errors: string[] = [];
  if (!name) errors.push("empty name");
  if (!rawEmail.includes("@")) errors.push(`invalid email: ${rawEmail}`);
  if (!Number.isInteger(age) || age < 0) errors.push(`invalid age: ${rawAge}`);
  return errors.length > 0 ? { ok: false, errors } : { ok: true, contact: { name, email: rawEmail.toLowerCase(), age } };
}

export function importContacts(csv: string): { contacts: Contact[]; errors: string[] } {
  const results = csv.split("\n").filter(Boolean).map(parseContact);
  return {
    contacts: results.flatMap((r) => (r.ok ? [r.contact] : [])),
    errors: results.flatMap((r) => (r.ok ? [] : r.errors)),
  };
}
