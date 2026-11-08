# Insider Trading

> **ID:** CS029 · **Category:** Couplers · **Sources:** Fowler 2018
>
> Modules that secretly exchange internal data instead of using explicit interfaces.

## Definition

**Insider trading** is a smell introduced by Fowler in the second edition of *Refactoring*: modules that
exchange internal data "on the quiet", beneath their public interfaces. One module reads or writes
another's internal structures, they share state through implicit channels, or they depend on
implementation details that are not part of the contract.

It is the module-level generalization of inappropriate intimacy: some exchange is inevitable, but it
must be explicit, minimal and visible.

## Symptoms

- A module imports "internal" symbols from another (`from billing._internal import ...`).
- Two modules share a mutable dictionary or structure to communicate.
- A subclass depends on implementation details of its base.
- Internal changes in one module break another without any public interface changing.

## Common causes

- Shortcuts to avoid designing an interface between modules.
- Module boundaries that do not reflect the real responsibilities.
- Inheritance across modules used to reach protected details.

## Why it is a problem

- Hidden coupling that does not show in the interfaces.
- A module cannot evolve without coordinating with another.
- Subtle bugs when shared state changes unexpectedly.

## Example (smelly)

```ts
// inventory.ts
export const _stockCache: Record<string, number> = {};

// orders.ts — SMELL: reads and writes inventory's internal state
import { _stockCache } from "./inventory";

export function placeOrder(sku: string, qty: number) {
  if ((_stockCache[sku] ?? 0) < qty) throw new Error("No stock");
  _stockCache[sku] -= qty;
}
```

## Solution (refactored)

```ts
// inventory.ts — explicit interface; state stays private to the module
const stock = new Map<string, number>();

export function reserve(sku: string, qty: number): boolean {
  const available = stock.get(sku) ?? 0;
  if (available < qty) return false;
  stock.set(sku, available - qty);
  return true;
}

// orders.ts
import { reserve } from "./inventory";

export function placeOrder(sku: string, qty: number) {
  if (!reserve(sku, qty)) throw new Error("No stock");
}
```

## Recommended refactorings

- **Move Function**: and **Move Field**: reduce the need for exchange between modules.
- **Hide Delegate**: turns access to a third party into an operation of the intermediate module.
- **Replace Subclass with Delegate**: or **Replace Superclass with Delegate** if the intimacy comes from inheritance.
- **Extract Class**: if what two modules share deserves a module of its own.

## When it may be acceptable

- Modules forming a cohesive unit within the same package, with a documented internal API (`internal` in C# or Go).
- A module's tests inspecting its internal state in a limited way.

## Related smells

- [Inappropriate Intimacy](inappropriate-intimacy.md) — the same problem at the class level.
- [Global Data](global-data.md) — state shared between modules is usually global.
- [Mutable Data](../06-data/mutable-data.md) — sharing mutable structures is the usual channel for hidden exchange.
- [Hidden Temporal Coupling](hidden-temporal-coupling.md) — implicit channels often impose hidden call orders.

## Automatic detection

| Language | Tools and rules |
|---|---|
| Python | Pylint `W0212 protected-access`, Ruff `SLF001`; `import-linter` lets you define layer and independence contracts between modules. |
| C# | The `internal` modifier and separate assemblies; ArchUnitNET or NDepend for dependency rules between namespaces. |
| React + TS | `no-restricted-imports` or `import/no-internal-modules`; `dependency-cruiser` for architecture rules. |
| Go | `internal/` packages (the compiler prevents importing them from outside); golangci-lint `depguard` for dependency rules. |

## Implementations

Each folder contains the `smelly` version, the `refactored` version and the tests showing that both have the same observable behavior.

| Language | Folder |
|---|---|
| Python | [`python/code_smells/couplers/insider_trading/`](../../../python/code_smells/couplers/insider_trading/) |
| C# | [`csharp/src/CodeSmells/Couplers/InsiderTrading/`](../../../csharp/src/CodeSmells/Couplers/InsiderTrading/) |
| React + TS | [`react-ts/src/smells/couplers/insider-trading/`](../../../react-ts/src/smells/couplers/insider-trading/) |
| Go | [`go/smells/couplers/insider-trading/`](../../../go/smells/couplers/insider-trading/) |

## References

- Fowler, M. (2018). *Refactoring: Improving the Design of Existing Code* (2nd ed.). Addison-Wesley. Refactoring catalog: https://refactoring.com/catalog/
- Jerzyk, M. and Madeyski, L. (2023). *Code Smells: A Comprehensive Online Catalog and Taxonomy*. Online catalog: https://codesmells.org
- Refactoring.Guru — Code Smells: https://refactoring.guru/refactoring/smells
- Fowler, M. — *CodeSmell* (bliki): https://martinfowler.com/bliki/CodeSmell.html
