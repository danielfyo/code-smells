# Derived State via useEffect

> **ID:** CS135 · **Category:** React + TS-specific · **Sources:** react.dev: You Might Not Need an Effect

## Definition

Storing in `useState` a value that can be computed from props or other state, and keeping it "in sync" with a
`useEffect` that calls `setState`. The derived value should simply be computed during render.

## Symptoms

- The pattern `useEffect(() => { setX(f(a, b)); }, [a, b])`.
- State such as `fullName`, `filteredItems`, `total`, `isValid` that depends only on other state.
- A first render with a wrong (empty or stale) value followed by a second, correct render.

## Common causes

- An "observer" mental model, or habits from class components (`componentDidUpdate`).
- Believing every displayed value must live in state.
- Worrying about the cost of the computation (which `useMemo` solves, not an effect).

## Why it is a problem

- **Double render**: React paints the old value, runs the effect, updates state and paints again.
- **Inconsistent frames**: for a moment the UI shows data that does not match its inputs.
- **Two sources of truth**: if someone calls `setX` from another path, the value drifts.
- More code, more dependencies to maintain and more risk of [stale closures](./stale-closure.md).

## How it works under the hood

React renders by calling the component; after committing the changes to the DOM, it runs effects. A `setState` inside
an effect schedules **another** full render. A variable computed in the component body, by contrast, is evaluated in
the same render from the current values, so it can never be out of date. If the computation is expensive,
`useMemo(() => f(a, b), [a, b])` caches it across renders without introducing a second cycle.

## Example (smelly)

```tsx
function CartSummary({ items }: { items: CartItem[] }) {
  const [total, setTotal] = useState(0);
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {                       // SMELL: derived state synchronised by hand
    setTotal(items.reduce((s, i) => s + i.price * i.qty, 0));
    setIsEmpty(items.length === 0);
  }, [items]);

  return isEmpty ? <p>Your cart is empty</p> : <p>Total: {total.toFixed(2)}</p>;
}
```

## Solution (refactored)

```tsx
function CartSummary({ items }: { items: CartItem[] }) {
  // REFACTOR: Replace Derived State with Calculation during render
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const isEmpty = items.length === 0;
  // If the computation were expensive:
  // const total = useMemo(() => expensiveTotal(items), [items]);
  return isEmpty ? <p>Your cart is empty</p> : <p>Total: {total.toFixed(2)}</p>;
}
```

## Recommended refactorings

- **Compute during render** (replace state with a local variable).
- **`useMemo`** only when a measurement shows the computation is expensive.
- To reset state when a prop changes, give the component a **`key`** instead of using an effect.

## When it may be acceptable

- When the value comes from an external system (a `ResizeObserver`, an API) rather than props/state: that is
  legitimate synchronisation.
- Integrations with imperative libraries that require the result to be written somewhere.

## Related smells

- [Props Copied into State](./props-copied-to-state.md)
- [Chains of Effects](./effect-chains.md)
- [Premature Memoization](./premature-memoization.md)
- [Mutable Data](../06-data/mutable-data.md)

## Automatic detection

- `react-hooks/exhaustive-deps` does not detect it (the effect usually has correct dependencies).
- Community ESLint plugins inspired by "You Might Not Need an Effect" exist; their coverage is partial.
- Code review: look for effects whose body only calls `setX` with computed values.

## Implementations

React + TypeScript-specific smell:

- React + TS: [`react-ts/src/smells/react_ts_specific/derived-state-in-effect/`](../../../react-ts/src/smells/react_ts_specific/derived-state-in-effect/)

## References

- React — *You Might Not Need an Effect*: https://react.dev/learn/you-might-not-need-an-effect
- React — *Choosing the State Structure*: https://react.dev/learn/choosing-the-state-structure
- React — `useMemo`: https://react.dev/reference/react/useMemo
