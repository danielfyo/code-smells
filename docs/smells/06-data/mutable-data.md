# Mutable Data

> **ID:** CS032 · **Category:** Data Dealers · **Sources:** Fowler 2018
>
> Data that changes in unexpected places, causing bugs that are hard to trace.

## Definition

**Mutable data** is a smell introduced by Fowler in the second edition of *Refactoring*: changes to data
often lead to unexpected consequences and tricky bugs, because one part of the code modifies data that
another part assumed to be stable. The wider the scope from which data can be modified, the greater the
risk.

Functional programming takes this idea to the limit (data never changes); short of that, the aim is to
restrict **where** and **when** data can be mutated and to prefer creating new values.

## Symptoms

- Functions that modify the objects or lists they receive as arguments.
- Objects shared between components that anyone can alter.
- Variables reassigned many times with different meanings.
- Getters that return references to mutable internal collections.
- Bugs that depend on the order in which functions run.

## Common causes

- An imperative habit of modifying in place for perceived efficiency.
- Languages where mutability is the default.
- Sharing references without copying at boundaries.

## Why it is a problem

- Action at a distance: a change in one place breaks something elsewhere.
- Race conditions in concurrent code.
- Reasoning about program state requires knowing the whole execution history.
- In React, mutating state prevents changes from being detected and the component from re-rendering.

## Example (smelly)

```ts
interface Order { lines: { sku: string; price: number }[]; total: number }

function applyCoupon(order: Order, percent: number): Order {
  // SMELL: modifies the received object; the caller loses the original
  for (const line of order.lines) {
    line.price = line.price * (1 - percent / 100);
  }
  order.total = order.lines.reduce((s, l) => s + l.price, 0);
  return order;
}
```

## Solution (refactored)

```ts
interface Line { readonly sku: string; readonly price: number }
interface Order { readonly lines: readonly Line[] }

const totalOf = (order: Order) => order.lines.reduce((s, l) => s + l.price, 0);

function applyCoupon(order: Order, percent: number): Order {
  return {
    ...order,
    lines: order.lines.map((l) => ({ ...l, price: l.price * (1 - percent / 100) })),
  };
}
```

The function returns a new order and the total is derived instead of stored, so it cannot get out of sync.

## Recommended refactorings

- **Encapsulate Variable**: restricts the places from which data is modified.
- **Split Variable**: one variable per meaning instead of reassigning.
- **Replace Derived Variable with Query**: computes the value instead of keeping it in sync.
- **Separate Query from Modifier**: isolates the functions that change state.
- **Remove Setting Method**: and **Change Reference to Value**: favor immutable objects.

## When it may be acceptable

- Small-scope local variables inside a function (accumulators, indexes).
- Performance-critical paths where copying is too expensive, with the mutation encapsulated.
- Objects whose identity and changing state are the concept (a bank account), as long as mutation goes through methods that protect the invariants.

## Related smells

- [Global Data](../05-couplers/global-data.md) — mutable data with global scope: the most dangerous case.
- [Side Effects](../07-functions/side-effects.md) — functions that mutate their arguments have side effects.
- [Output Arguments](../07-functions/output-arguments.md) — arguments mutated to return results.
- [Direct State Mutation](../16-react-ts/direct-state-mutation.md) — React variant.
- [Mutable Default Argument](../14-python/mutable-default-argument.md) — Python variant with mutable default arguments.
- [Exposing Mutable Collections](../15-csharp/exposed-mutable-collections.md) — C# variant.

## Automatic detection

| Language | Tools and rules |
|---|---|
| Python | Pylint `W0102 dangerous-default-value`, Ruff `B006`; `@dataclass(frozen=True)`, `tuple`/`frozenset` and `typing.Final` with mypy. |
| C# | `IDE0044` (make field `readonly`), `CA2227` (collections with setters), `CA1819` (properties returning arrays); `record` and `init` for immutability. |
| React + TS | ESLint `prefer-const`, `no-param-reassign` (with `props: true`); `@typescript-eslint/prefer-readonly`; `Readonly<T>`/`readonly T[]`; eslint-plugin-functional `immutable-data`. |
| Go | revive `modifies-parameter` and `modifies-value-receiver`; `go test -race` for concurrent mutations. |

## Implementations

Each folder contains the `smelly` version, the `refactored` version and the tests showing that both have the same observable behavior.

| Language | Folder |
|---|---|
| Python | [`python/code_smells/data/mutable_data/`](../../../python/code_smells/data/mutable_data/) |
| C# | [`csharp/src/CodeSmells/Data/MutableData/`](../../../csharp/src/CodeSmells/Data/MutableData/) |
| React + TS | [`react-ts/src/smells/data/mutable-data/`](../../../react-ts/src/smells/data/mutable-data/) |
| Go | [`go/smells/data/mutable-data/`](../../../go/smells/data/mutable-data/) |

## References

- Fowler, M. (2018). *Refactoring: Improving the Design of Existing Code* (2nd ed.). Addison-Wesley. Refactoring catalog: https://refactoring.com/catalog/
- Jerzyk, M. and Madeyski, L. (2023). *Code Smells: A Comprehensive Online Catalog and Taxonomy*. Online catalog: https://codesmells.org
- Refactoring.Guru — Code Smells: https://refactoring.guru/refactoring/smells
- Fowler, M. — *CodeSmell* (bliki): https://martinfowler.com/bliki/CodeSmell.html
