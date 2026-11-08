export interface Address {
  city: string;
  postalCode: string;
}

export interface Customer {
  name: string;
  address?: Address;
  vip?: boolean;
}

// SMELL: Overridden Safeties. The compiler warned that `address` may be missing
// and that `points` is not part of the type, but instead of listening it was
// silenced with `!`, `as any` and `@ts-ignore`. The result compiles...
// and crashes at runtime with the first customer without an address.
export function CustomerCard({ customer }: { customer: Customer }) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const city = customer.address!.city.toUpperCase();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const points: number = (customer as any).points ?? 0;
  return (
    <p>
      {customer.name} ({city}) · {points} points
      {/* @ts-ignore -- "it works already" */}
      {customer.vip && " · VIP"}
    </p>
  );
}
