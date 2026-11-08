# God Component / Large Component

> **ID:** CS134 · **Category:** React + TS-specific · **Sources:** Ferreira 2022

## Definition

A god component is React's version of the [Large Class](../01-bloaters/large-class.md): a single component that
fetches data, manages lots of state, applies business rules, handles events and also renders the whole UI. It
typically runs well past 200-300 lines with JSX spanning several screens.

## Symptoms

- Many `useState`, `useEffect` and handlers in the same function body.
- `fetch` calls, validation, price calculations, formatting and JSX all mixed together.
- JSX with clearly separable sections (header, filters, table, modal, footer) sharing the same state.
- Tests must mount the entire component and mock the network to check a single business rule.

## Common causes

- Prototypes that reach production without refactoring.
- Fear of "fragmenting" the code or unfamiliarity with custom hooks.
- Always adding features to the same file because "the state already lives there".

## Why it is a problem

- **Broad re-renders**: any state change re-runs the whole function and all of its JSX.
- **Hard to test**: logic cannot be tested without rendering.
- **Frequent merge conflicts**: the whole team edits the same file.
- **Divergent change**: the file changes for UI, data and business reasons at once.

## How it works under the hood

A function component is a function React calls on every render; all its hooks run in order and all its JSX is rebuilt.
The more state lives in one component, the more reasons it has to re-render, and its whole subtree goes with it.
Splitting it into smaller components bounds which part of the tree depends on which state, and extracting custom
hooks (`useOrders`) separates *stateful logic* from *presentation* without changing behaviour: a hook is simply a
function that calls other hooks.

## Example (smelly)

```tsx
export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {                                    // SMELL: data fetching
    fetch('/api/orders').then(r => r.json()).then(setOrders).finally(() => setLoading(false));
  }, []);
  const visible = orders.filter(o => o.customer.includes(filter));
  const total = visible.reduce((s, o) => s + o.amount * (o.vip ? 0.9 : 1), 0); // SMELL: business rule
  if (loading) return <p>Loading…</p>;
  return (
    <div>
      <input value={filter} onChange={e => setFilter(e.target.value)} />
      <table>{visible.map(o => <tr key={o.id} onClick={() => setSelected(o)}>…</tr>)}</table>
      <p>Total: {total.toFixed(2)}</p>
      {selected && <div className="modal">…{/* 80 more lines */}</div>}
    </div>
  );
}
```

## Solution (refactored)

```tsx
// REFACTOR: Extract Hook + Extract Component + pure logic in a module
export function orderTotal(orders: Order[]): number {          // domain/orders.ts
  return orders.reduce((s, o) => s + o.amount * (o.vip ? 0.9 : 1), 0);
}

export function OrdersPage() {
  const { orders, loading } = useOrders();                      // hooks/useOrders.ts
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState<Order | null>(null);
  if (loading) return <p>Loading…</p>;
  const visible = orders.filter(o => o.customer.includes(filter));
  return (
    <div>
      <OrderFilter value={filter} onChange={setFilter} />
      <OrderTable orders={visible} onSelect={setSelected} />
      <OrderSummary total={orderTotal(visible)} />
      {selected && <OrderDetailModal order={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
```

## Recommended refactorings

- **Extract Component**: a piece of JSX with its own responsibility becomes its own component.
- **Extract Custom Hook**: stateful logic and effects (`useOrders`, `useOrderFilter`).
- **Move Function** into pure modules for business rules (see [Business Logic in Components](./business-logic-in-components.md)).
- Container/presentational split when it helps test the UI in isolation.

## When it may be acceptable

- Very simple pages or throwaway prototypes.
- Long but linear components (a form with many fields and no logic) can be readable as they are.

## Related smells

- [Large Class / God Class](../01-bloaters/large-class.md)
- [Long Method](../01-bloaters/long-method.md)
- [Too Many Related useState](./useState-explosion.md)
- [Business Logic in Components](./business-logic-in-components.md)
- [Divergent Change](../03-change-preventers/divergent-change.md)

## Automatic detection

- ESLint core: `max-lines`, `max-lines-per-function`, `complexity`, `max-statements`.
- `eslint-plugin-react`: `no-multi-comp` (several components per file, an indirect signal).
- Metrics tools (SonarQube/SonarJS cognitive complexity).

## Implementations

React + TypeScript-specific smell:

- React + TS: [`react-ts/src/smells/react_ts_specific/god-component/`](../../../react-ts/src/smells/react_ts_specific/god-component/)

## References

- React — *Thinking in React*: https://react.dev/learn/thinking-in-react
- React — *Reusing Logic with Custom Hooks*: https://react.dev/learn/reusing-logic-with-custom-hooks
- Ferreira, F.; Valente, M. T. — *Detecting code smells in React-based Web apps* (2022).
