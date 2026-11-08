# Stale Closure / Missing Dependencies

> **ID:** CS138 · **Category:** React + TS-specific · **Sources:** eslint-plugin-react-hooks

## Definition

An effect, `useCallback` or `useMemo` that reads props or state but does not declare them in its dependency array.
The function is "frozen" with the values of the render in which it was created and keeps using old data even though
the component already has new values.

## Symptoms

- `// eslint-disable-next-line react-hooks/exhaustive-deps` above a hook.
- A counter in a `setInterval` that gets stuck at 1; a handler that submits the previous filter.
- Empty dependency arrays (`[]`) on effects that read component variables.

## Common causes

- Using `[]` so the effect "only runs on mount".
- Avoiding an infinite loop by removing dependencies instead of restructuring the code.
- Not knowing about functional updates (`setX(prev => ...)`) or `useRef`.

## Why it is a problem

- **Intermittent bugs** that are hard to reproduce: they depend on render order.
- Wrong data sent to servers (the payload from an earlier render).
- Silencing the linter hides future mistakes in the same hook.

## How it works under the hood

Each render is a new call to the component function, with its own constant `props` and `state` (*state as a
snapshot*). Functions created in that render close over those constants: a plain JavaScript closure. React decides
whether to reuse the previous function or effect by comparing each item of the dependency array with `Object.is`. If
a dependency is missing, React assumes nothing changed and keeps the old closure, which still sees the value from its
original render. Functional updates avoid reading state from the closure, and a `ref` provides a mutable box shared by
all renders.

## Example (smelly)

```tsx
function OrderCountdown({ onExpire }: { onExpire: (left: number) => void }) {
  const [secondsLeft, setSecondsLeft] = useState(60);

  useEffect(() => {
    const id = setInterval(() => {
      setSecondsLeft(secondsLeft - 1);      // SMELL: always sees secondsLeft = 60
      if (secondsLeft <= 1) onExpire(secondsLeft);
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);                                   // SMELL: missing dependencies

  return <span>{secondsLeft}s</span>;
}
```

## Solution (refactored)

```tsx
function OrderCountdown({ onExpire }: { onExpire: (left: number) => void }) {
  const [secondsLeft, setSecondsLeft] = useState(60);

  useEffect(() => {
    // REFACTOR: functional update; the interval no longer needs to read state
    const id = setInterval(() => setSecondsLeft(s => Math.max(s - 1, 0)), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (secondsLeft === 0) onExpire(0);     // REFACTOR: complete dependencies
  }, [secondsLeft, onExpire]);

  return <span>{secondsLeft}s</span>;
}
```

## Recommended refactorings

- **Declare every dependency** and restructure the code if that causes loops.
- **Functional updates** (`setX(prev => …)`) or **`useReducer`** so the closure does not read state.
- **Move functions inside the effect** or outside the component so they are not dependencies.
- **`useRef`** for values that must be read "at their latest" without re-running the effect (React is stabilising
  `useEffectEvent` for this case).

## When it may be acceptable

- Disabling `exhaustive-deps` is practically never a good idea. If a value must not trigger the effect, separate the
  event logic from the reactive logic instead of lying about dependencies.

## Related smells

- [Missing Effect Cleanup](./missing-effect-cleanup.md)
- [Chains of Effects](./effect-chains.md)
- [Premature Memoization](./premature-memoization.md)
- [Loop Variable Capture (Go)](../17-go/loop-variable-capture.md) — another closure capturing more than expected.
- [Hidden Logical Dependency](../11-general/hidden-logical-dependency.md)

## Automatic detection

- **`react-hooks/exhaustive-deps`** (eslint-plugin-react-hooks): flags missing or unnecessary dependencies.
- **`react-hooks/rules-of-hooks`**: guarantees a stable hook call order.
- Search the codebase for `eslint-disable` comments targeting that rule.

## Implementations

React + TypeScript-specific smell:

- React + TS: [`react-ts/src/smells/react_ts_specific/stale-closure/`](../../../react-ts/src/smells/react_ts_specific/stale-closure/)

## References

- React — *Removing Effect Dependencies*: https://react.dev/learn/removing-effect-dependencies
- React — *State as a Snapshot*: https://react.dev/learn/state-as-a-snapshot
- React — *Separating Events from Effects*: https://react.dev/learn/separating-events-from-effects
- eslint-plugin-react-hooks: https://www.npmjs.com/package/eslint-plugin-react-hooks
