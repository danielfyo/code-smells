# Nested Ternaries in JSX

> **ID:** CS146 · **Category:** React + TS-specific · **Sources:** React community

## Definition

Chaining ternary operators (`a ? <X/> : b ? <Y/> : c ? <Z/> : <W/>`) inside JSX to decide what to render. Because JSX
only accepts expressions, the ternary is the tool at hand, but nested it becomes unreadable and error-prone.

## Symptoms

- Two or more levels of `? :` in the same JSX block.
- Confusing parentheses and indentation; Prettier produces a "staircase".
- Overlapping conditions (`loading && error`) whose evaluation order decides the outcome.

## Common causes

- Adding states (loading, error, empty, data) to a component that started with a single ternary.
- Wanting to keep everything inside the `return` instead of extracting.
- State modelled with several booleans instead of one discriminated state.

## Why it is a problem

- **Readability**: it is hard to tell what is shown in each case.
- **Forgotten cases**: it is easy to omit a state or put it in the wrong order.
- **Hard to change**: adding a branch means restructuring the whole expression.

## How it works under the hood

JSX compiles to `jsx(type, props)` calls; inside `{ }` only expressions are allowed, not statements such as `if` or
`switch`. But the component body is an ordinary function: you can use early returns, intermediate variables or helper
functions before the `return`. If the state is modelled as a **discriminated union** (`status: 'loading' | 'error' |
'ready'`), a `switch` on the discriminant narrows the type in each branch and TypeScript can verify that every case is
covered.

## Example (smelly)

```tsx
function OrderHistory({ loading, error, orders }: Props) {
  return (
    <section>
      {loading ? (
        <Spinner />
      ) : error ? (                                         // SMELL: nested ternary
        <ErrorBanner message={error.message} />
      ) : orders.length === 0 ? (                           // SMELL: third level
        <p>You have no orders yet</p>
      ) : (
        <OrderTable orders={orders} />
      )}
    </section>
  );
}
```

## Solution (refactored)

```tsx
type HistoryState =
  | { status: 'loading' }
  | { status: 'error'; error: Error }
  | { status: 'ready'; orders: Order[] };

// REFACTOR: discriminated state + a helper with early returns
function OrderHistory({ state }: { state: HistoryState }) {
  return <section>{renderContent(state)}</section>;
}

function renderContent(state: HistoryState): React.ReactNode {
  switch (state.status) {
    case 'loading': return <Spinner />;
    case 'error':   return <ErrorBanner message={state.error.message} />;
    case 'ready':
      return state.orders.length === 0 ? <p>You have no orders yet</p> : <OrderTable orders={state.orders} />;
  }
}
```

## Recommended refactorings

- **Early returns** (*Replace Nested Conditional with Guard Clauses*).
- **Extract a function or component** that encapsulates the decision.
- **Model state as a discriminated union** and use an exhaustive `switch`.
- **Component map** (`Record<Status, ReactNode>`) when branches are simple.

## When it may be acceptable

- A single short ternary (`isOpen ? 'Close' : 'Open'`) is idiomatic and clear.
- `cond && <X />` to show or hide an element.

## Related smells

- [Deep Nesting](../07-functions/deep-nesting.md)
- [Complicated Boolean Expression](../07-functions/complicated-boolean-expression.md)
- [Boolean Props Explosion](./boolean-prop-explosion.md)
- [Too Many Related useState](./useState-explosion.md)
- [Switch Statements](../02-oo-abusers/switch-statements.md)

## Automatic detection

- ESLint core: **`no-nested-ternary`** (a variant also exists in `eslint-plugin-unicorn`).
- `@typescript-eslint/switch-exhaustiveness-check` for the resulting `switch`.

## Implementations

React + TypeScript-specific smell:

- React + TS: [`react-ts/src/smells/react_ts_specific/nested-ternaries-jsx/`](../../../react-ts/src/smells/react_ts_specific/nested-ternaries-jsx/)

## References

- React — *Conditional Rendering*: https://react.dev/learn/conditional-rendering
- TypeScript Handbook — *Narrowing* (discriminated unions): https://www.typescriptlang.org/docs/handbook/2/narrowing.html
- ESLint — `no-nested-ternary`: https://eslint.org/docs/latest/rules/no-nested-ternary
