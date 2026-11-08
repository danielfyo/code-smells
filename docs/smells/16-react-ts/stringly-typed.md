# Stringly Typed Code

> **ID:** CS151 · **Category:** React + TS-specific · **Sources:** TypeScript community

## Definition

Representing with free-form `string` values that belong to a closed set (order statuses, roles, currencies, event
names) or that have structure (identifiers of different kinds). TypeScript can express those sets with literal unions
and discriminated types; using `string` gives that safety away.

## Symptoms

- `status: string` compared against literals: `if (order.status === 'shiped')` (typo not caught).
- Functions that accept `string` but only work with a handful of specific values.
- `switch` over strings with no `default`, or with a `default` that throws "unknown status".
- Identifiers that can be swapped by mistake (`customerId` passed where `orderId` is expected).

## Common causes

- Types generated from JSON or databases and never refined.
- JavaScript habits.
- Unfamiliarity with literal unions, `as const` and template literal types.

## Why it is a problem

- **Typos** detected only at runtime.
- **No exhaustiveness**: adding a new status does not force `switch` statements to be updated.
- **No autocompletion** or implicit documentation of the valid set.

## How it works under the hood

In TypeScript a literal like `'paid'` is a type in itself. A union `'pending' | 'paid' | 'shipped'` restricts the
accepted values at compile time and enables **narrowing** in `if`/`switch`; in the `default` branch the remaining
value has type `never`, which enables an exhaustiveness check. `as const` derives the union from a runtime array of
values, avoiding a duplicated list. Branded types (`string & { __brand: 'OrderId' }`) distinguish structurally
identical identifiers, compensating for structural typing.

## Example (smelly)

```tsx
type Order = { id: string; status: string; currency: string };   // SMELL

function statusLabel(order: Order): string {
  if (order.status === 'pending') return 'Pending';
  if (order.status === 'payed') return 'Paid';                    // typo: never matches
  if (order.status === 'shipped') return 'Shipped';
  return 'Unknown';
}

function StatusBadge({ order }: { order: Order }) {
  return <span className={`badge badge-${order.status}`}>{statusLabel(order)}</span>;
}
```

## Solution (refactored)

```tsx
// REFACTOR: Replace String with Union of Literals (derived from an as-const array)
export const ORDER_STATUSES = ['pending', 'paid', 'shipped', 'cancelled'] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];
type Currency = 'EUR' | 'USD';
type Order = { id: string; status: OrderStatus; currency: Currency };

const LABELS: Record<OrderStatus, string> = {                     // a missing key is an error
  pending: 'Pending', paid: 'Paid', shipped: 'Shipped', cancelled: 'Cancelled',
};

function StatusBadge({ order }: { order: Order }) {
  return <span className={`badge badge-${order.status}`}>{LABELS[order.status]}</span>;
}
```

## Recommended refactorings

- **Replace `string` with a literal union** (or an `enum` if the team prefers).
- **`Record<Union, T>`** for lookup tables that must cover every case.
- **Discriminated unions** when each case carries different data.
- **Branded types** for identifiers.
- **Validate at the boundary** strings coming from outside before converting them to the union.

## When it may be acceptable

- Genuinely free text (names, descriptions, search queries).
- Open sets controlled by another system that change without redeploying the frontend; validate them anyway.

## Related smells

- [Primitive Obsession](../01-bloaters/primitive-obsession.md)
- [Magic Numbers](../06-data/magic-numbers.md)
- [Boolean Props Explosion](./boolean-prop-explosion.md)
- [any Abuse](./any-type.md)

## Automatic detection

- `@typescript-eslint/switch-exhaustiveness-check`: requires every member of a union to be handled.
- `@typescript-eslint/no-unnecessary-condition`: flags impossible comparisons once typed as a union.
- No rule detects `string` where a union should be: this needs review.

## Implementations

React + TypeScript-specific smell:

- React + TS: [`react-ts/src/smells/react_ts_specific/stringly-typed/`](../../../react-ts/src/smells/react_ts_specific/stringly-typed/)

## References

- TypeScript Handbook — *Everyday Types* (literal types): https://www.typescriptlang.org/docs/handbook/2/everyday-types.html
- TypeScript Handbook — *Template Literal Types*: https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html
- TypeScript Handbook — *Narrowing* (exhaustiveness checking): https://www.typescriptlang.org/docs/handbook/2/narrowing.html
