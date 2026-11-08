// SMELL: Data Clumps. street, city, postalCode and country always travel
// together through functions and props, but they are never grouped. Adding a
// field (e.g. "province") would force us to change every signature.
export function formatAddress(street: string, city: string, postalCode: string, country: string): string {
  return `${street}, ${postalCode} ${city} (${country})`;
}

export function isDomestic(street: string, city: string, postalCode: string, country: string): boolean {
  // SMELL: takes four parameters and needs only one, but "they go together".
  void street;
  void city;
  void postalCode;
  return country === "ES";
}

export function shippingCost(postalCode: string, country: string): number {
  if (country !== "ES") return 15;
  return postalCode.startsWith("35") || postalCode.startsWith("38") ? 9 : 4;
}

interface ShippingLabelProps {
  recipient: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export function ShippingLabel({ recipient, street, city, postalCode, country }: ShippingLabelProps) {
  return (
    <div role="note">
      <strong>{recipient}</strong>
      <p>{formatAddress(street, city, postalCode, country)}</p>
      <p>{isDomestic(street, city, postalCode, country) ? "Domestic" : "International"}</p>
      <p>Shipping: {shippingCost(postalCode, country)} €</p>
    </div>
  );
}
