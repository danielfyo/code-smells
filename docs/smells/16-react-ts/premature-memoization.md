# Premature Memoization

> **ID:** CS149 · **Category:** React + TS-specific · **Sources:** react.dev

## Definition

Systematically wrapping values in `useMemo`, functions in `useCallback` and components in `memo` "just in case",
without having measured a performance problem. It adds complexity, dependency arrays to maintain and comparison cost,
almost always with no observable benefit.

## Symptoms

- `useMemo(() => a + b, [a, b])` for trivial calculations.
- `useCallback` on handlers passed to native DOM elements (`<button onClick>`).
- `memo` on components whose props change every render (object literals, `children`).
- No performance profile justifying the optimisation.

## Common causes

- Believing "more memoization = faster".
- Team rules applied mechanically.
- Habits carried over from projects with real performance problems.

## Why it is a problem

- **Noise**: the essential code is buried under wrappers.
- **Dependency bugs**: incomplete arrays produce [stale closures](./stale-closure.md).
- **Real cost**: every `useMemo` stores values and compares dependencies on each render.
- **False sense of optimisation**: a single unstable prop defeats the whole `memo` chain.

## How it works under the hood

`useMemo` and `useCallback` keep the result from the previous render and reuse it if **all** dependencies are equal
according to `Object.is`; `memo` skips re-rendering a component if **all** its props are shallowly equal. They only
pay off when the computation is expensive or when a stable identity saves work downstream (a memoised child, an
effect dependency). If a memoised child receives `children` or a new object literal, the comparison always fails and
memoization is pure overhead. When enabled, the React Compiler memoises automatically and makes most manual
memoization unnecessary.

## Example (smelly)

```tsx
const PriceTag = memo(function PriceTag({ price, style }: { price: number; style: React.CSSProperties }) {
  const formatted = useMemo(() => `$${price.toFixed(2)}`, [price]);   // SMELL: trivial
  return <span style={style}>{formatted}</span>;
});

function ProductCard({ product }: { product: Product }) {
  const handleClick = useCallback(() => console.log(product.id), [product.id]); // SMELL: goes to a <button>
  const fullName = useMemo(() => product.brand + ' ' + product.name, [product]); // SMELL
  return (
    <div>
      <h3>{fullName}</h3>
      <PriceTag price={product.price} style={{ color: 'green' }} /> {/* new object: memo is useless */}
      <button onClick={handleClick}>View</button>
    </div>
  );
}
```

## Solution (refactored)

```tsx
// REFACTOR: Remove Premature Optimization; memoise only after measuring
function PriceTag({ price, style }: { price: number; style: React.CSSProperties }) {
  return <span style={style}>${price.toFixed(2)}</span>;
}

function ProductCard({ product }: { product: Product }) {
  return (
    <div>
      <h3>{product.brand} {product.name}</h3>
      <PriceTag price={product.price} style={{ color: 'green' }} />
      <button onClick={() => console.log(product.id)}>View</button>
    </div>
  );
}
// If the Profiler shows a real bottleneck (e.g. a 5,000-row list),
// then memo + stable useCallback where it matters, or virtualisation.
```

## Recommended refactorings

- **Remove unjustified memoization** (*Inline*).
- **Measure first** with the React DevTools Profiler.
- **Restructure before memoising**: push state down, pass JSX as `children`, split components.
- Consider the **React Compiler** for automatic memoization.

## When it may be acceptable

- Genuinely expensive computations (sorting or filtering thousands of items) measured as slow.
- Values that are dependencies of effects or of memoised children and need a stable identity.
- Large lists where `memo` on the row avoids thousands of renders.

## Related smells

- [Speculative Generality](../04-dispensables/speculative-generality.md)
- [Stale Closure / Missing Dependencies](./stale-closure.md)
- [Clutter](../04-dispensables/clutter.md)
- [Derived State via useEffect](./derived-state-in-effect.md)

## Automatic detection

- There is no standard rule that detects unnecessary memoization.
- `react-hooks/exhaustive-deps` validates the dependencies of `useMemo`/`useCallback`.
- React DevTools Profiler to decide based on data.

## Implementations

React + TypeScript-specific smell:

- React + TS: [`react-ts/src/smells/react_ts_specific/premature-memoization/`](../../../react-ts/src/smells/react_ts_specific/premature-memoization/)

## References

- React — `useMemo` ("Should you add useMemo everywhere?"): https://react.dev/reference/react/useMemo
- React — `useCallback`: https://react.dev/reference/react/useCallback
- React — `memo`: https://react.dev/reference/react/memo
- React — *React Developer Tools*: https://react.dev/learn/react-developer-tools
