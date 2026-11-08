# Vertical Separation

> **ID:** CS069 · **Category:** General · **Sources:** Clean Code G10

*Variables and functions defined far away from where they are used.*

## Definition

Variables and functions are defined far from where they are used: local variables declared at the top of a
long function and used at the end, or private functions placed hundreds of lines above or below their only
caller. *Clean Code* (G10, *Vertical Separation*) recommends declaring variables just before their first use
and placing private functions immediately below the code that calls them.

## Symptoms

- Declaration blocks at the top of functions (C89 style).
- Constant jumping around the file to follow a call chain.
- Variables initialized long before they are needed, sometimes with values that change in between.
- Helper functions grouped by kind (all private ones at the end) instead of by proximity of use.

## Common causes

- Habits from old languages that required declarations at the top.
- Files that grow by appending functions at the end without reorganizing.
- Automatic ordering by visibility or alphabetically.

## Why it is a problem

- **Higher working-memory load** for the reader.
- **Needlessly wide scopes** that make accidental reuse of variables easier.
- Harder to see which fragments could be extracted into functions.

## Example (smelly)

```typescript
function buildInvoice(order: Order): Invoice {
  // SMELL: everything declared up here, used far below
  const taxRate = taxRateFor(order.country);
  const discount = loyaltyDiscount(order.customer);
  let lines: InvoiceLine[] = [];
  let notes = "";

  // ... 25 lines of validation that use none of the above ...

  lines = order.items.map(toInvoiceLine);
  notes = order.giftMessage ?? "";
  return { lines, notes, total: applyTax(applyDiscount(sum(lines), discount), taxRate) };
}
```

## Solution (refactored)

```typescript
function buildInvoice(order: Order): Invoice {
  validateOrder(order); // REFACTOR: Extract Function for the validation

  // REFACTOR: Slide Statements; each value is declared next to its use
  const lines = order.items.map(toInvoiceLine);
  const discount = loyaltyDiscount(order.customer);
  const taxRate = taxRateFor(order.country);
  const total = applyTax(applyDiscount(sum(lines), discount), taxRate);
  return { lines, notes: order.giftMessage ?? "", total };
}
```

## Recommended refactorings

- **Slide Statements** to bring declaration and use together.
- **Extract Function** to shrink the distance naturally.
- **Split Variable** when a variable declared at the top is reused for several purposes.
- Reorder the file following the **stepdown rule**: each function followed by the ones it calls.

## When it may be acceptable

- Module or class constants, which are grouped at the top by convention.
- Languages or styles that require a specific ordering (members grouped by visibility in some C# guidelines).

## Related smells

- [Short Names for Long Scopes](../10-names/short-names-long-scopes.md): distance makes short names worse.
- [Long Method](../01-bloaters/long-method.md): long methods create vertical separation.
- [Temporary Field](../02-oo-abusers/temporary-field.md): state declared far from its use, at class level.
- [Hidden Temporal Coupling](../05-couplers/hidden-temporal-coupling.md): variables prepared long before they are used.

## Automatic detection

- **TypeScript**: ESLint `prefer-const` and `one-var` help with declarations; `no-use-before-define` enforces the opposite ordering.
- **Python**: Pylint `R0914` (`too-many-locals`) and function complexity (`C901`) point to functions where separation is likely.
- **C#**: there is no specific Roslyn rule; `IDE0059` (unnecessary assignment) detects variables initialized with values that are overwritten before use, a common symptom of premature declarations.
- **Go**: the language itself favors `:=` close to use; `ineffassign` detects assignments that are never read.

There is no standard "usage distance" metric; code review and function extraction are the main defenses.

## Implementations

- Python: [`python/code_smells/general/vertical_separation/`](../../../python/code_smells/general/vertical_separation/)
- C#: [`csharp/src/CodeSmells/General/VerticalSeparation/`](../../../csharp/src/CodeSmells/General/VerticalSeparation/)
- React + TS: [`react-ts/src/smells/general/vertical-separation/`](../../../react-ts/src/smells/general/vertical-separation/)
- Go: [`go/smells/general/vertical-separation/`](../../../go/smells/general/vertical-separation/)

Each folder contains a `smelly` version (the smell, marked with `SMELL:` comments) and a `refactored` version (marked with `REFACTOR:` comments), plus tests showing that both have the same observable behavior.

## References

- Martin, R. C. (2008). *Clean Code*, ch. 17 "Smells and Heuristics". Prentice Hall.
- Fowler, M. (2018). *Refactoring: Improving the Design of Existing Code* (2nd ed.). Addison-Wesley. Refactoring catalog: https://refactoring.com/catalog/
- Jerzyk, M. and Madeyski, L. (2023). "Code Smells: A Comprehensive Online Catalog and Taxonomy". Online catalog: https://codesmells.org
