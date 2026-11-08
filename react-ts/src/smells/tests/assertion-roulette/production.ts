// Production code: parsing a postal address line "Street, Number, ZIP City".
export interface Address {
  street: string;
  number: string;
  postalCode: string;
  city: string;
}

export function parseAddress(line: string): Address {
  const [street = "", number = "", rest = ""] = line.split(",").map((part) => part.trim());
  const [postalCode = "", ...cityWords] = rest.split(/\s+/);
  return { street, number, postalCode, city: cityWords.join(" ") };
}
