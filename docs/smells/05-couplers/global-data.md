# Global Data

> **ID:** CS028 · **Category:** Couplers · **Sources:** Fowler 2018
>
> Global state that can be modified from anywhere, impossible to trace and to test.

## Definition

**Global data** means variables that can be accessed and modified from any part of the program: global
variables, mutable static fields, stateful singletons, module or package variables. Fowler added it as
a smell in the second edition of *Refactoring* and calls it one of the most pungent: any line of code
can change it and there is no easy way to know which one did.

The problem is not scope by itself (global constants are harmless) but **mutability** combined with scope.

## Symptoms

- Global or module variables reassigned inside functions (`global counter`).
- Mutable `static` fields, stateful singletons, package variables in Go.
- Tests that fail depending on execution order because they share state.
- Functions whose result depends on something that does not appear in their signature.

## Common causes

- Convenience for sharing data without passing it as parameters.
- Configuration or caches implemented as global variables.
- The *Singleton* pattern used as a state container.

## Why it is a problem

- Hard-to-trace bugs: any code may have modified the data.
- Non-isolated, interdependent tests.
- Race conditions in concurrent code.
- Hidden dependencies that make reuse difficult.

## Example (smelly)

```python
_cart_items = []          # SMELL: mutable global state
discount_rate = 0.0

def add_item(price):
    _cart_items.append(price)

def apply_promo():
    global discount_rate
    discount_rate = 0.1

def total():
    return sum(_cart_items) * (1 - discount_rate)
```

## Solution (refactored)

```python
class Cart:
    def __init__(self):
        self._items: list[float] = []
        self._discount_rate = 0.0

    def add_item(self, price: float) -> None:
        self._items.append(price)

    def apply_promo(self, rate: float = 0.1) -> None:
        self._discount_rate = rate

    def total(self) -> float:
        return sum(self._items) * (1 - self._discount_rate)
```

Each cart encapsulates its own state; tests create independent instances.

## Recommended refactorings

- **Encapsulate Variable**: first step: all access goes through functions, which let you control and trace writes.
- **Move Function**: and **Move Field**: move the state into an object with limited scope.
- **Parameterize Function**: passes the data as a parameter (dependency injection).

## When it may be acceptable

- Global constants and immutables (configuration frozen after startup).
- Registries initialized once at startup and read-only afterwards.
- Loggers and other cross-cutting utilities with no state observable by the logic.

## Related smells

- [Mutable Data](../06-data/mutable-data.md) — mutability is what makes global data dangerous.
- [Inappropriate Static](../02-oo-abusers/inappropriate-static.md) — statics with state are global data.
- [global Statement](../14-python/global-statement.md) — Python variant.
- [Static Mutable State](../15-csharp/static-mutable-state.md) — C# variant.
- [Mutable Package-level State](../17-go/package-level-state.md) — Go variant.
- [Monolithic / Overused Context](../16-react-ts/context-overuse.md) — React variant: using context as a global store.

## Automatic detection

| Language | Tools and rules |
|---|---|
| Python | Pylint `W0603 global-statement`, `W0602 global-variable-not-assigned`; Ruff `PLW0603`, `PLW0602`. |
| C# | `CA2211` (non-constant fields should not be visible); SonarQube `S2696` (instance method writing a static field), `S1444`, `S2386`. |
| React + TS | ESLint `no-implicit-globals`, `no-global-assign`; `import/no-mutable-exports` (eslint-plugin-import). |
| Go | golangci-lint `gochecknoglobals`; `go test -race` detects races on shared variables. |

## Implementations

Each folder contains the `smelly` version, the `refactored` version and the tests showing that both have the same observable behavior.

| Language | Folder |
|---|---|
| Python | [`python/code_smells/couplers/global_data/`](../../../python/code_smells/couplers/global_data/) |
| C# | [`csharp/src/CodeSmells/Couplers/GlobalData/`](../../../csharp/src/CodeSmells/Couplers/GlobalData/) |
| React + TS | [`react-ts/src/smells/couplers/global-data/`](../../../react-ts/src/smells/couplers/global-data/) |
| Go | [`go/smells/couplers/global-data/`](../../../go/smells/couplers/global-data/) |
| Angular | [`angular/src/smells/couplers/global-data/`](../../../angular/src/smells/couplers/global-data/) |

## References

- Fowler, M. (2018). *Refactoring: Improving the Design of Existing Code* (2nd ed.). Addison-Wesley. Refactoring catalog: https://refactoring.com/catalog/
- Jerzyk, M. and Madeyski, L. (2023). *Code Smells: A Comprehensive Online Catalog and Taxonomy*. Online catalog: https://codesmells.org
- Refactoring.Guru — Code Smells: https://refactoring.guru/refactoring/smells
- Fowler, M. — *CodeSmell* (bliki): https://martinfowler.com/bliki/CodeSmell.html
