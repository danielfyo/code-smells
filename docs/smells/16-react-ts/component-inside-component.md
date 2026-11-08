# Component Defined Inside Component

> **ID:** CS144 · **Category:** React + TS-specific · **Sources:** react.dev

## Definition

Declaring a component (a function that returns JSX and is used as `<Item />`) inside the body of another component.
Every render of the parent creates a new function, which React treats as a **different component type**: it unmounts
the previous one, loses its state and DOM, and mounts a new one.

## Symptoms

- `function Parent() { const Row = () => <tr>…</tr>; return <Row />; }`.
- Inputs that lose focus after every keystroke.
- A child's local state resetting "for no reason"; animations replaying.
- Mount effects that run on every parent render.

## Common causes

- Wanting to access the parent's variables without passing them as props.
- Organising code "by proximity" without knowing how React identifies components.

## Why it is a problem

- **Lost state** and focus on every render.
- **Performance**: the whole DOM subtree is recreated instead of updated.
- Repeated mount/unmount effects (duplicate requests, reopened subscriptions).

## How it works under the hood

During reconciliation React decides whether an element is "the same" by comparing its **type** and **position** (and
`key`). The type of `<Row />` is the reference to the function `Row`. If `Row` is defined inside the parent, each
render produces a new function with a different identity (`Row_render1 !== Row_render2`). React sees a different type
at the same position and therefore unmounts the old subtree (discarding its state) and mounts a new one. Defining the
component at module top level gives it a stable identity; the parent's data is passed as props.

## Example (smelly)

```tsx
function ProductSearch({ products }: { products: Product[] }) {
  const [query, setQuery] = useState('');

  function SearchBox() {                                // SMELL: a new type on every render
    return <input value={query} onChange={e => setQuery(e.target.value)} />;
  }

  return (
    <>
      <SearchBox />                                     {/* loses focus while typing */}
      <ul>{products.filter(p => p.name.includes(query)).map(p => <li key={p.id}>{p.name}</li>)}</ul>
    </>
  );
}
```

## Solution (refactored)

```tsx
// REFACTOR: Move Component to module scope + pass data via props
function SearchBox({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return <input value={value} onChange={e => onChange(e.target.value)} />;
}

function ProductSearch({ products }: { products: Product[] }) {
  const [query, setQuery] = useState('');
  return (
    <>
      <SearchBox value={query} onChange={setQuery} />
      <ul>{products.filter(p => p.name.includes(query)).map(p => <li key={p.id}>{p.name}</li>)}</ul>
    </>
  );
}
```

## Recommended refactorings

- **Move the component to module scope** and give it explicit props.
- If it is just a stateless piece of JSX, **call it as a function** (`{renderRow(p)}`) or assign the JSX to a
  variable, instead of using it as `<Component />`.
- Extract it into its own file if it grows.

## When it may be acceptable

- Render-prop functions that are invoked as plain functions, not as JSX elements.
- Components created only once outside render (e.g. in a module-level factory), although this is usually an
  unnecessary complication.

## Related smells

- [Array Index as Key](./index-as-key.md) — another reconciliation identity problem.
- [God Component](./god-component.md)
- [Premature Memoization](./premature-memoization.md)

## Automatic detection

- **`eslint-plugin-react`: `react/no-unstable-nested-components`** flags components defined inside other components.
- `react/no-multi-comp` (indirect signal).

## Implementations

React + TypeScript-specific smell:

- React + TS: [`react-ts/src/smells/react_ts_specific/component-inside-component/`](../../../react-ts/src/smells/react_ts_specific/component-inside-component/)

## References

- React — *Preserving and Resetting State* (different components at the same position reset state): https://react.dev/learn/preserving-and-resetting-state
- React — *Your First Component* (never nest component definitions): https://react.dev/learn/your-first-component
- eslint-plugin-react — `no-unstable-nested-components`: https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-unstable-nested-components.md
