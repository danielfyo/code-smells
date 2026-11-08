# Chains of Effects

> **ID:** CS147 · **Category:** React + TS-specific · **Sources:** react.dev

## Definition

Several chained `useEffect` hooks where each one updates state that triggers the next effect: A changes → effect 1
sets B → effect 2 sets C → effect 3 sets D. The logic for a single event is spread over a cascade of renders and
effects.

## Symptoms

- Effects whose only job is calling `setX` in response to other state.
- Following the flow requires jumping between several effects in the component.
- Several consecutive renders for a single user interaction (visible in the Profiler).
- Infinite loops when a dependency is added.

## Common causes

- Thinking "when X changes, do Y" instead of "when the user does Z, compute everything".
- Derived values stored in state (see [Derived State via useEffect](./derived-state-in-effect.md)).
- Reacting to an event from an effect instead of from the handler.

## Why it is a problem

- **Cascading renders**: every link triggers an extra full render.
- **Visible intermediate states**: the UI shows inconsistent combinations for a few frames.
- **Fragile**: reordering or reusing a step can break the chain or create loops.
- Hard to debug and to test.

## How it works under the hood

Effects run after the render is committed. Each `setState` inside an effect schedules another render, after which the
dependencies of every effect are evaluated again. A chain of N effects produces up to N extra renders and commits. By
contrast, all state updates inside a single event handler are **batched** into one render. That is why logic that
responds to a user action belongs in the handler, and derivable values are computed during render.

## Example (smelly)

```tsx
function ShippingForm() {
  const [country, setCountry] = useState('ES');
  const [region, setRegion] = useState('');
  const [shippingCost, setShippingCost] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => { setRegion(defaultRegion(country)); }, [country]);                   // SMELL 1
  useEffect(() => { setShippingCost(costFor(country, region)); }, [country, region]);   // SMELL 2
  useEffect(() => { setTotal(SUBTOTAL + shippingCost); }, [shippingCost]);              // SMELL 3

  return <CountrySelect value={country} onChange={setCountry} /* … */ />;
}
```

## Solution (refactored)

```tsx
function ShippingForm() {
  const [country, setCountry] = useState('ES');
  const [region, setRegion] = useState(defaultRegion('ES'));

  // REFACTOR: event logic lives in the handler (a single render)
  function handleCountryChange(next: string) {
    setCountry(next);
    setRegion(defaultRegion(next));
  }

  // REFACTOR: derivable values are computed during render
  const shippingCost = costFor(country, region);
  const total = SUBTOTAL + shippingCost;

  return <CountrySelect value={country} onChange={handleCountryChange} /* … */ />;
}
```

## Recommended refactorings

- **Move the logic into the event handler** that originates the change.
- **Compute derived values during render**.
- **`useReducer`** for transitions that update several fields together consistently.
- Reserve effects for **synchronising with external systems** (network, DOM, subscriptions).

## When it may be acceptable

- Chains where each step depends on a network response (e.g. dependent selects that load options from the server),
  although a data library (TanStack Query) usually expresses this better.

## Related smells

- [Derived State via useEffect](./derived-state-in-effect.md)
- [Props Copied into State](./props-copied-to-state.md)
- [Stale Closure / Missing Dependencies](./stale-closure.md)
- [Hidden Temporal Coupling](../05-couplers/hidden-temporal-coupling.md)
- [Callback Hell](../11-general/callback-hell.md)

## Automatic detection

- No official rule detects chains; `react-hooks/exhaustive-deps` only validates dependencies.
- The React DevTools Profiler shows several commits per interaction.
- Code review: effects that contain nothing but `setState` calls.

## Implementations

React + TypeScript-specific smell:

- React + TS: [`react-ts/src/smells/react_ts_specific/effect-chains/`](../../../react-ts/src/smells/react_ts_specific/effect-chains/)

## References

- React — *You Might Not Need an Effect* (chains of computations): https://react.dev/learn/you-might-not-need-an-effect
- React — *Queueing a Series of State Updates*: https://react.dev/learn/queueing-a-series-of-state-updates
- React — *Extracting State Logic into a Reducer*: https://react.dev/learn/extracting-state-logic-into-a-reducer
