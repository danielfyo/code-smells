# Array Index as Key

> **ID:** CS140 · **Category:** React + TS-specific · **Sources:** react.dev

## Definition

Using an element's position in the array (`key={index}`) as its `key` when rendering a list that can be reordered,
filtered or have items inserted. The `key` stops identifying the item and starts identifying its position, so state
and DOM nodes get attached to the wrong item.

## Symptoms

- `items.map((item, i) => <Row key={i} … />)`.
- After deleting the first item, the text typed into an `<input>` "jumps" to the next row.
- Checked boxes or animations showing up on rows they do not belong to.

## Common causes

- Silencing the "Each child in a list should have a unique key prop" warning.
- Data without a stable identifier (generated client-side or lacking an `id` from the API).

## Why it is a problem

- **Mixed-up state**: a child's internal state (uncontrolled inputs, `useState`) ends up on the wrong row.
- **Performance**: React updates many elements instead of moving one.
- Bugs that only appear when reordering or deleting, easily missed by simple tests.

## How it works under the hood

During reconciliation React compares the new list with the previous one and matches children by `key`. If the `key`
matches, React treats it as the same component: it keeps its state and DOM node and only updates its props. With
indexes, when item 0 is removed, the former item 1 now has `key=0`, so React hands it the state and DOM of the deleted
item and "removes" the last one. A stable `key` (a domain `id`) lets React see that exactly one item was removed and
move the rest. Generating the key during render (`Math.random()`) is just as bad: it forces everything to unmount and
remount on every render.

## Example (smelly)

```tsx
function GuestList({ guests, onRemove }: { guests: Guest[]; onRemove: (id: string) => void }) {
  return (
    <ul>
      {guests.map((g, i) => (
        <li key={i}>                                {/* SMELL: key = position */}
          {g.name} <input placeholder="Note" />    {/* uncontrolled DOM state */}
          <button onClick={() => onRemove(g.id)}>Remove</button>
        </li>
      ))}
    </ul>
  );
}
```

## Solution (refactored)

```tsx
function GuestList({ guests, onRemove }: { guests: Guest[]; onRemove: (id: string) => void }) {
  return (
    <ul>
      {guests.map(g => (
        <li key={g.id}>                             {/* REFACTOR: stable domain identity */}
          {g.name} <input placeholder="Note" />
          <button onClick={() => onRemove(g.id)}>Remove</button>
        </li>
      ))}
    </ul>
  );
}
// If the data has no id, assign one when it is created (crypto.randomUUID()), never during render.
```

## Recommended refactorings

- **Use a domain identifier** (`id`, `sku`, `email`) as the `key`.
- **Assign ids when the data is created** on the client, not during render.
- Use `key` deliberately to **reset state** too (`<Form key={customerId} />`).

## When it may be acceptable

- Static lists that are never reordered, filtered or modified and whose items hold no state (e.g. bullet points of
  fixed text). Even then, prefer an id if one exists.

## Related smells

- [Component Defined Inside Component](./component-inside-component.md) — another reconciliation identity problem.
- [Direct State Mutation](./direct-state-mutation.md)
- [Imprecision](../11-general/imprecision.md)

## Automatic detection

- **`eslint-plugin-react`: `react/no-array-index-key`** flags using the `map` index as `key`.
- `react/jsx-key` flags list elements without a `key`.
- React logs a console warning when the `key` is missing, but not when it is the index.

## Implementations

React + TypeScript-specific smell:

- React + TS: [`react-ts/src/smells/react_ts_specific/index-as-key/`](../../../react-ts/src/smells/react_ts_specific/index-as-key/)

## References

- React — *Rendering Lists* ("Keeping list items in order with key"): https://react.dev/learn/rendering-lists
- React — *Preserving and Resetting State*: https://react.dev/learn/preserving-and-resetting-state
- eslint-plugin-react — `no-array-index-key`: https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-array-index-key.md
