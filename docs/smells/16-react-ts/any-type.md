# any Abuse

> **ID:** CS141 · **Category:** React + TS-specific · **Sources:** typescript-eslint no-explicit-any

## Definition

Using the `any` type to silence the compiler. `any` switches off type checking for that value and for everything
derived from it: any property access, call or assignment is allowed, and the error surfaces at runtime, far away from
its origin.

## Symptoms

- Parameters, props or API responses typed as `any`, `any[]` or `Record<string, any>`.
- `catch (e: any)` followed by `e.response.data.message`.
- `as any` to escape a compilation error.
- No editor autocompletion on important domain data.

## Common causes

- Migrations from JavaScript with `noImplicitAny` turned off.
- Haste when facing a complex type error.
- External data (JSON, `localStorage`, untyped libraries) left unmodelled.

## Why it is a problem

- **Contagion**: `const total = order.amount * 2` is `any` if `order` is; the type spreads silently.
- **Unsafe refactors**: renaming a field produces no errors where it is used through `any`.
- **Production errors** (`Cannot read properties of undefined`) the compiler could have prevented.

## How it works under the hood

TypeScript has two "top-like" types: `any` and `unknown`. `any` is assignable to everything and everything is
assignable to it, so it disables analysis in both directions. `unknown` accepts any value but cannot be used until it
is **narrowed** with `typeof`, `in`, `instanceof` or a type guard. Because types are erased at compile time (*type
erasure*), there is no runtime check whatsoever: what TypeScript does not verify at compile time is never verified.
That is why external data must be validated with real code (guards or libraries such as Zod).

## Example (smelly)

```tsx
async function loadInvoice(id: string): Promise<any> {      // SMELL: any at the boundary
  const res = await fetch(`/api/invoices/${id}`);
  return res.json();
}

function InvoiceTotal({ invoice }: { invoice: any }) {       // SMELL: props without a contract
  const total = invoice.lines.reduce((s: any, l: any) => s + l.price * l.qty, 0);
  return <p>{invoice.customer.nmae}: {total.toFixed(2)}</p>; // typo goes unnoticed
}
```

## Solution (refactored)

```tsx
type InvoiceLine = { price: number; qty: number };
type Invoice = { id: string; customer: { name: string }; lines: InvoiceLine[] };

function isInvoice(v: unknown): v is Invoice {               // REFACTOR: unknown + type guard
  return typeof v === 'object' && v !== null && 'id' in v && 'lines' in v && Array.isArray(v.lines);
}

async function loadInvoice(id: string): Promise<Invoice> {
  const data: unknown = await (await fetch(`/api/invoices/${id}`)).json();
  if (!isInvoice(data)) throw new Error('invalid invoice response');
  return data;
}

function InvoiceTotal({ invoice }: { invoice: Invoice }) {
  const total = invoice.lines.reduce((s, l) => s + l.price * l.qty, 0);
  return <p>{invoice.customer.name}: {total.toFixed(2)}</p>;
}
```

## Recommended refactorings

- **Replace `any` with a concrete type** or with **`unknown` + narrowing**.
- **Generics** (`function first<T>(xs: T[]): T | undefined`) instead of `any` for reusable code.
- **Validate at the boundary** with type guards or schemas (Zod, Valibot) that infer the type.
- Enable `strict` (which includes `noImplicitAny` and `useUnknownInCatchVariables`).

## When it may be acceptable

- Gradual migrations from JavaScript, clearly marked and with a plan to remove them.
- Very low-level utility signatures where generics cannot express the type, isolated behind a typed API.

## Related smells

- [Type Assertion (as) Abuse](./type-assertion-abuse.md)
- [Non-null Assertion Abuse](./non-null-assertion.md)
- [Stringly Typed Code](./stringly-typed.md)
- [Empty Interface Abuse (Go)](../17-go/empty-interface-abuse.md)
- [Overridden Safeties](../08-error-handling/overridden-safeties.md)

## Automatic detection

- **`@typescript-eslint/no-explicit-any`**: forbids explicit `any`.
- `@typescript-eslint/no-unsafe-assignment`, `no-unsafe-member-access`, `no-unsafe-call`, `no-unsafe-return`: flag uses of `any` values.
- `tsconfig`: `"strict": true` (`noImplicitAny`, `useUnknownInCatchVariables`).

## Implementations

React + TypeScript-specific smell:

- React + TS: [`react-ts/src/smells/react_ts_specific/any-type/`](../../../react-ts/src/smells/react_ts_specific/any-type/)

## References

- TypeScript Handbook — *Everyday Types* (`any`): https://www.typescriptlang.org/docs/handbook/2/everyday-types.html
- TypeScript Handbook — *Narrowing*: https://www.typescriptlang.org/docs/handbook/2/narrowing.html
- typescript-eslint — `no-explicit-any`: https://typescript-eslint.io/rules/no-explicit-any/
- TSConfig — `noImplicitAny`: https://www.typescriptlang.org/tsconfig#noImplicitAny
