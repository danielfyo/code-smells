import { useRef } from "react";

export interface Customer {
  id: number;
  name: string;
  email?: string;
}

// REFACTOR: the "no value" case is handled explicitly with narrowing, optional chaining
// and a result type that models it (undefined), instead of silencing the compiler.
export function customerEmailDomain(customers: Customer[], id: number): string | undefined {
  const customer = customers.find((c) => c.id === id);
  const email = customer?.email;
  if (!email) return undefined;
  return email.split("@")[1];
}

export function SearchBox() {
  const inputRef = useRef<HTMLInputElement>(null);
  const focus = () => inputRef.current?.focus();
  return (
    <div>
      <input ref={inputRef} aria-label="Search customer" />
      <button onClick={focus}>Search</button>
    </div>
  );
}
