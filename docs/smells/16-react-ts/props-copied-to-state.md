# Props Copied into State

> **ID:** CS136 · **Category:** React + TS-specific · **Sources:** react.dev

## Definition

Initialising `useState` with a prop (`useState(props.value)`) and then using that copy as if it were the prop. The
state only takes the initial value: when the parent changes the prop, the copy does not update, and you end up with
two sources of truth that diverge.

## Symptoms

- `const [x, setX] = useState(props.x)` and from then on only `x` is read.
- Bugs like "I select a different customer in the list and the form still shows the previous one".
- Effects that try to patch it: `useEffect(() => setX(props.x), [props.x])`.

## Common causes

- Wanting to "edit" the prop locally without clearly modelling who owns the data.
- Mistaking the argument of `useState` for a reactive value.

## Why it is a problem

- **Silent desynchronisation** between parent and child.
- The effect-based patch adds an extra render and overwrites the user's local edits.
- Hard to reason about: it is unclear which of the two values is the real one.

## How it works under the hood

The argument to `useState(initial)` is only used on the **first render** of that component instance; afterwards React
returns the stored value and ignores the argument. React preserves state while the component stays at the same
position in the tree with the same type and the same `key`. Hence there are three clean ways out: read the prop
directly (controlled component), make it explicit that it is only an initial value (`initialX`), or change the `key`
so React discards the state and mounts a fresh instance.

## Example (smelly)

```tsx
function CustomerEditor({ customer }: { customer: Customer }) {
  const [name, setName] = useState(customer.name);   // SMELL: a copy that never updates
  return <input value={name} onChange={e => setName(e.target.value)} />;
}

// In the parent:
<CustomerEditor customer={selectedCustomer} />  // when selectedCustomer changes, name stays the same
```

## Solution (refactored)

```tsx
// REFACTOR (a): the prop is only an initial value and is reset with a key
function CustomerEditor({ initialName }: { initialName: string }) {
  const [name, setName] = useState(initialName);
  return <input value={name} onChange={e => setName(e.target.value)} />;
}
<CustomerEditor key={selectedCustomer.id} initialName={selectedCustomer.name} />

// REFACTOR (b): controlled component; the parent is the single owner
function CustomerNameInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return <input value={value} onChange={e => onChange(e.target.value)} />;
}
```

## Recommended refactorings

- **Read the prop directly** if the component does not need to modify it.
- **Lift state up** and make the child controlled.
- **Rename to `initialX`/`defaultX`** when it really is an initial value, and **reset with `key`**.

## When it may be acceptable

- Edit forms with a local "draft" that deliberately ignore external changes until saved, provided the prop is named
  `initialX` and a `key` is used to reset it.

## Related smells

- [Derived State via useEffect](./derived-state-in-effect.md)
- [Chains of Effects](./effect-chains.md)
- [Duplicate Code](../04-dispensables/duplicate-code.md) — duplicated data, in this case.
- [Global Data](../05-couplers/global-data.md)

## Automatic detection

- There is no official rule in `eslint-plugin-react-hooks`. `eslint-plugin-react` has `no-unused-prop-types`, which does not cover it.
- Code review: search for `useState(props.` or `useState(<destructured prop>)` without an `initial` prefix.

## Implementations

React + TypeScript-specific smell:

- React + TS: [`react-ts/src/smells/react_ts_specific/props-copied-to-state/`](../../../react-ts/src/smells/react_ts_specific/props-copied-to-state/)

## References

- React — *Choosing the State Structure* ("Don't mirror props in state"): https://react.dev/learn/choosing-the-state-structure
- React — *Preserving and Resetting State*: https://react.dev/learn/preserving-and-resetting-state
- React — *You Might Not Need an Effect*: https://react.dev/learn/you-might-not-need-an-effect
