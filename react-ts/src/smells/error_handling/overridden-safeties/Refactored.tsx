export interface Address {
  city: string;
  postalCode: string;
}

export interface Customer {
  name: string;
  address?: Address;
  vip?: boolean;
  points?: number;
}

// REFACTOR: listen to the compiler instead of silencing it. The type is widened
// with the field that actually exists (`points`), the "no address" case is
// handled explicitly and no `!`, `any` or `@ts-ignore` remains.
export function CustomerCard({ customer }: { customer: Customer }) {
  const city = customer.address?.city.toUpperCase() ?? "NO ADDRESS";
  const points = customer.points ?? 0;
  return (
    <p>
      {customer.name} ({city}) · {points} points
      {customer.vip && " · VIP"}
    </p>
  );
}
