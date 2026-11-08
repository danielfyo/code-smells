import { useRef } from "react";

export interface Customer {
  id: number;
  name: string;
  email?: string;
}

// SMELL: non-null assertion (!). It promises the compiler that the value exists when it
// may not: find() can return undefined and email is optional. The error TypeScript would
// have prevented shows up at runtime.
export function customerEmailDomain(customers: Customer[], id: number): string {
  const customer = customers.find((c) => c.id === id)!;
  return customer.email!.split("@")[1]!;
}

export function SearchBox() {
  const inputRef = useRef<HTMLInputElement>(null);
  // SMELL: ref.current! assumes the input is already mounted and always exists.
  const focus = () => inputRef.current!.focus();
  return (
    <div>
      <input ref={inputRef} aria-label="Search customer" />
      <button onClick={focus}>Search</button>
    </div>
  );
}
