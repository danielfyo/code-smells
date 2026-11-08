# Non-null Assertion Abuse

> **ID:** CS142 · **Category:** React + TS-specific · **Sources:** typescript-eslint

## Definition

Using the postfix `!` operator (`user!.email`, `ref.current!`, `map.get(id)!`) to claim that a value is neither `null`
nor `undefined` without checking it. It is a promise to the compiler that nobody verifies: if it is false, the program
crashes at runtime with a `TypeError`.

## Symptoms

- `!` sprinkled after `find`, `get`, `querySelector`, `useContext` or `ref.current`.
- Chains such as `order!.customer!.address!.city`.
- Production errors `Cannot read properties of undefined` on lines containing `!`.

## Common causes

- Turning on `strictNullChecks` in an existing project and "fixing" the errors with `!`.
- Implicit assumptions ("this id always exists") not captured in the types.
- React contexts created with `createContext<T | null>(null)` and consumed without a guard.

## Why it is a problem

- **Late, distant failures**: the crash happens where the value is used, not where it went missing.
- **`strictNullChecks` is defeated** exactly where it matters most.
- It hides real business cases (order not found, user not logged in) that should be handled.

## How it works under the hood

With `strictNullChecks`, `null` and `undefined` are distinct types and TypeScript forces you to narrow `T | undefined`
before using it. The `!` operator removes `null | undefined` from the type **only in the compiler**: it is erased when
emitting JavaScript and generates no check. The real alternatives do emit code: a guard (`if (!x) return`), optional
chaining `?.`, the `??` operator, or an assertion function (`asserts x is T`) that throws a clear error at the exact
spot.

## Example (smelly)

```tsx
const SessionContext = createContext<Session | null>(null);

function CheckoutButton({ productId }: { productId: string }) {
  const session = useContext(SessionContext)!;                  // SMELL
  const product = useProducts().find(p => p.id === productId)!; // SMELL
  return (
    <button onClick={() => buy(session.user.id, product.price)}>
      Buy {product.name}
    </button>
  );
}
```

## Solution (refactored)

```tsx
function useSession(): Session {
  const session = useContext(SessionContext);
  if (session === null) throw new Error('useSession must be used inside <SessionProvider>');
  return session;                                    // REFACTOR: guard with an explicit error
}

function CheckoutButton({ productId }: { productId: string }) {
  const session = useSession();
  const product = useProducts().find(p => p.id === productId);
  if (!product) return <p>Product unavailable</p>;   // REFACTOR: real case handled
  return (
    <button onClick={() => buy(session.user.id, product.price)}>Buy {product.name}</button>
  );
}
```

## Recommended refactorings

- **Early guards** (*Replace Nested Conditional with Guard Clauses*) that narrow the type.
- **`?.` and `??`** when absence has a sensible default.
- **Assertion functions** (`function assertDefined<T>(v: T): asserts v is NonNullable<T>`) with a useful message.
- **Context hooks with a guard** (`useSession`) instead of `useContext(...)!`.
- Model absence in the domain (discriminated states `loading | ready | notFound`).

## When it may be acceptable

- Tests, where an immediate failure is fine and the value was just created.
- Cases where an invariant guaranteed by nearby code cannot be expressed in the type system, with a comment
  justifying it.

## Related smells

- [Type Assertion (as) Abuse](./type-assertion-abuse.md)
- [any Abuse](./any-type.md)
- [Null Abuse](../06-data/null-abuse.md)
- [Overridden Safeties](../08-error-handling/overridden-safeties.md)

## Automatic detection

- **`@typescript-eslint/no-non-null-assertion`**: forbids the `!` operator.
- `@typescript-eslint/no-unnecessary-type-assertion`: flags superfluous `!`.
- `@typescript-eslint/no-extra-non-null-assertion` and `non-nullable-type-assertion-style`.
- `tsconfig`: `strictNullChecks` (part of `strict`) and `noUncheckedIndexedAccess`.

## Implementations

React + TypeScript-specific smell:

- React + TS: [`react-ts/src/smells/react_ts_specific/non-null-assertion/`](../../../react-ts/src/smells/react_ts_specific/non-null-assertion/)

## References

- TypeScript Handbook — *Everyday Types* (Non-null Assertion Operator): https://www.typescriptlang.org/docs/handbook/2/everyday-types.html
- TypeScript Handbook — *Narrowing*: https://www.typescriptlang.org/docs/handbook/2/narrowing.html
- typescript-eslint — `no-non-null-assertion`: https://typescript-eslint.io/rules/no-non-null-assertion/
- TSConfig — `strictNullChecks`: https://www.typescriptlang.org/tsconfig#strictNullChecks
