// REFACTOR: Introduce Parameter Object / Extract Class. The group of data that
// always travels together becomes the `Address` type, and the functions that
// operate on it take a single argument.
export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export const formatAddress = (a: Address): string => `${a.street}, ${a.postalCode} ${a.city} (${a.country})`;

export const isDomestic = (a: Address): boolean => a.country === "ES";

const CANARY_ISLANDS_PREFIXES = ["35", "38"];

// REFACTOR: behaviour moves closer to the data it uses.
export function shippingCost(a: Address): number {
  if (!isDomestic(a)) return 15;
  return CANARY_ISLANDS_PREFIXES.some((p) => a.postalCode.startsWith(p)) ? 9 : 4;
}

interface ShippingLabelProps {
  recipient: string;
  address: Address;
}

export function ShippingLabel({ recipient, address }: ShippingLabelProps) {
  return (
    <div role="note">
      <strong>{recipient}</strong>
      <p>{formatAddress(address)}</p>
      <p>{isDomestic(address) ? "Domestic" : "International"}</p>
      <p>Shipping: {shippingCost(address)} €</p>
    </div>
  );
}
