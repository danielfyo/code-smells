# Type Assertion (as) Abuse

> **ID:** CS143 · **Category:** React + TS-specific · **Sources:** typescript-eslint

## Definition

Using `value as Type` (or `<Type>value`) to force external or uncertain data into a specific shape without validating
it. An assertion changes what the compiler *believes*, not what the value *is*. The extreme case is the double
assertion `as unknown as Type`, which turns anything into anything.

## Symptoms

- `await res.json() as Order`, `JSON.parse(raw) as Settings`, `localStorage.getItem(k) as Theme`.
- `{} as Customer` to build "half-finished" objects.
- `as unknown as` to sidestep incompatibilities.
- Runtime errors from missing or mistyped fields even though "the type says it exists".

## Common causes

- Confusing assertions with the checked casts of other languages (C#, Java).
- No validation layer at the boundaries (API, storage, forms).
- Imprecise library typings.

## Why it is a problem

- **False confidence**: the rest of the code trusts a type nobody verified.
- **Distant failures**: the error shows up where the field is used, not where the data came in.
- **Silent API changes**: if the backend renames a field, the compiler does not notice.

## How it works under the hood

TypeScript uses **structural typing** and **type erasure**: types exist only at compile time and are removed when
JavaScript is emitted. An assertion `x as T` generates no code; it merely requires `T` and the type of `x` to be
"sufficiently compatible" (one assignable to the other). That is why `as unknown as T` always compiles: `unknown` is
compatible with everything. A type guard (`v is T`) or a validation schema (Zod), by contrast, is JavaScript that
actually runs and, through narrowing, also informs the compiler. The `satisfies` operator checks a literal against a
type without widening it or lying.

## Example (smelly)

```ts
type Booking = { id: string; guest: string; nights: number; checkIn: string };

export async function fetchBooking(id: string): Promise<Booking> {
  const res = await fetch(`/api/bookings/${id}`);
  return (await res.json()) as Booking;           // SMELL: nobody checks the shape
}

export function loadDraft(): Booking {
  const raw = localStorage.getItem('draft') ?? '{}';
  return JSON.parse(raw) as Booking;               // SMELL: '{}' "is" a Booking
}

const empty = {} as Booking;                       // SMELL: incomplete object
```

## Solution (refactored)

```ts
import { z } from 'zod';

// REFACTOR: the schema is the source of truth; the type is inferred from it
const BookingSchema = z.object({
  id: z.string(), guest: z.string(), nights: z.number().int().positive(), checkIn: z.string(),
});
type Booking = z.infer<typeof BookingSchema>;

export async function fetchBooking(id: string): Promise<Booking> {
  const res = await fetch(`/api/bookings/${id}`);
  return BookingSchema.parse(await res.json());    // validated at runtime
}

export function loadDraft(): Booking | null {
  const parsed = BookingSchema.safeParse(JSON.parse(localStorage.getItem('draft') ?? 'null'));
  return parsed.success ? parsed.data : null;      // absence is explicit
}
```

## Recommended refactorings

- **Validate at the boundary** with type guards (`v is T`) or schemas (Zod, Valibot, io-ts).
- **`satisfies`** to check literals without losing precision.
- **Build complete objects**, or use `Partial<T>` honestly instead of `{} as T`.
- Type everything coming from outside as **`unknown`** and narrow it.

## When it may be acceptable

- `as const` (not an unsafe assertion, but a way to infer literal types).
- DOM elements whose class is known (`document.getElementById('c') as HTMLCanvasElement`) in controlled code, though
  an `instanceof` check is more robust.
- Tests with partial objects, when building the full object adds nothing.

## Related smells

- [any Abuse](./any-type.md)
- [Non-null Assertion Abuse](./non-null-assertion.md)
- [Empty Interface Abuse (Go)](../17-go/empty-interface-abuse.md)
- [Overridden Safeties](../08-error-handling/overridden-safeties.md)

## Automatic detection

- **`@typescript-eslint/consistent-type-assertions`**: with `assertionStyle: 'never'` it forbids assertions; with
  `objectLiteralTypeAssertions: 'never'` it forbids `{} as T`.
- `@typescript-eslint/no-unsafe-type-assertion` (recent typescript-eslint versions): flags assertions that unsafely narrow a type.
- `@typescript-eslint/no-unnecessary-type-assertion`.

## Implementations

React + TypeScript-specific smell:

- React + TS: [`react-ts/src/smells/react_ts_specific/type-assertion-abuse/`](../../../react-ts/src/smells/react_ts_specific/type-assertion-abuse/)

## References

- TypeScript Handbook — *Everyday Types* (Type Assertions): https://www.typescriptlang.org/docs/handbook/2/everyday-types.html
- TypeScript Handbook — *Type Compatibility*: https://www.typescriptlang.org/docs/handbook/type-compatibility.html
- typescript-eslint — `consistent-type-assertions`: https://typescript-eslint.io/rules/consistent-type-assertions/
- Zod: https://zod.dev
