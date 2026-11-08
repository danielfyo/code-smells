# Direct State Mutation

> **ID:** CS139 · **Category:** React + TS-specific · **Sources:** react.dev

## Definition

Modifying an object or array held in state in place (`items.push(x)`, `user.name = ...`) and then calling `setState`
with the same reference, or not calling it at all. React does not detect the change and does not re-render, or does so
unpredictably.

## Symptoms

- `state.push`, `state.splice`, `state.sort()`, `obj.field = value` on values obtained from `useState`.
- `setItems(items)` right after mutating `items`.
- "The list only updates when I click something else."
- Components wrapped in `memo` that never update.

## Common causes

- Habits from imperative programming or frameworks with mutation-based reactivity.
- Array methods that mutate without making it obvious (`sort`, `reverse`, `splice`).
- Nested objects: the top level is copied but the inner object is mutated.

## Why it is a problem

- **Stale UI**: React skips the render because the reference is identical.
- **Memoization bugs**: `useMemo`, `memo` and dependency arrays compare references.
- Features that rely on immutable snapshots break (undo, time travel, concurrent transitions).

## How it works under the hood

When `setState(next)` is called, React compares `next` with the current value using `Object.is`. If they are the same
reference, it may bail out without rendering. Mutating an object does not change its reference, so to React "nothing
changed". Moreover, state must be treated as a snapshot of a render: mutating it also alters what other closures and
pending renders see. The fix is to create new objects with spread, `map`, `filter` or `toSorted`, or to use Immer,
which produces an immutable copy from a "mutation" applied to a draft.

## Example (smelly)

```tsx
function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);

  function add(title: string) {
    todos.push({ id: crypto.randomUUID(), title, done: false }); // SMELL: mutates state
    setTodos(todos);                                             // same reference: no re-render
  }
  function toggle(id: string) {
    const t = todos.find(t => t.id === id)!;
    t.done = !t.done;                                            // SMELL: mutates an element
    setTodos([...todos]);                                        // shallow copy: old object changed
  }
  return <ul>{todos.map(t => <li key={t.id} onClick={() => toggle(t.id)}>{t.title}</li>)}</ul>;
}
```

## Solution (refactored)

```tsx
function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);

  function add(title: string) {
    // REFACTOR: create a new array
    setTodos(prev => [...prev, { id: crypto.randomUUID(), title, done: false }]);
  }
  function toggle(id: string) {
    // REFACTOR: create a new object only for the element that changes
    setTodos(prev => prev.map(t => (t.id === id ? { ...t, done: !t.done } : t)));
  }
  return <ul>{todos.map(t => <li key={t.id} onClick={() => toggle(t.id)}>{t.title}</li>)}</ul>;
}
```

## Recommended refactorings

- **Immutable updates**: spread, `map`, `filter`, `concat`, `toSorted`, `toReversed`, `with`.
- **`useReducer`** with pure transition functions for complex state.
- **Immer** (`produce` or `useImmer`) when nesting makes manual copying verbose.
- `readonly`/`ReadonlyArray` types in TypeScript so the compiler prevents mutation.

## When it may be acceptable

- Values stored in `useRef`, which exist precisely to be mutated without re-rendering.
- Local variables created in the same render before being passed to `setState`.

## Related smells

- [Mutable Data](../06-data/mutable-data.md)
- [Side Effects](../07-functions/side-effects.md)
- [Premature Memoization](./premature-memoization.md)
- [Too Many Related useState](./useState-explosion.md)

## Automatic detection

- `eslint-plugin-react`: `no-direct-mutation-state` (class components only, `this.state`).
- TypeScript: typing state as `readonly` / `ReadonlyArray<T>` makes `push` or assignments fail to compile.
- Community immutability plugins (e.g. `eslint-plugin-functional`) forbid mutation in general.

## Implementations

React + TypeScript-specific smell:

- React + TS: [`react-ts/src/smells/react_ts_specific/direct-state-mutation/`](../../../react-ts/src/smells/react_ts_specific/direct-state-mutation/)

## References

- React — *Updating Objects in State*: https://react.dev/learn/updating-objects-in-state
- React — *Updating Arrays in State*: https://react.dev/learn/updating-arrays-in-state
- React — `useState`: https://react.dev/reference/react/useState
- Immer: https://immerjs.github.io/immer/
