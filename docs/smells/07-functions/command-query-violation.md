# Command-Query Separation Violation

> **ID:** CS045 · **Category:** Functions & Conditional Logic · **Sources:** Meyer; Clean Code
>
> Functions that both change state and return information, creating ambiguity.

## Definition

The **command-query separation** principle (CQS), formulated by Bertrand Meyer, states that every function
should be **either a command** that performs an action (changes state and returns nothing) **or a query**
that returns information without observable effects, but not both. *Clean Code* echoes it in chapter 3:
functions should either do something or answer something.

It is violated when a function changes state **and** returns a value, like a `set(attr, value)` that
returns whether the attribute existed: `if set("user", "bob")` is ambiguous.

## Symptoms

- Functions that modify state and return a success `bool` or a computed value.
- Getters that initialize, increment counters or consume elements.
- Calling a "query" twice gives different results.
- `if` conditions that modify the system when evaluated.

## Common causes

- The convenience of returning "something useful" from a command.
- Legacy APIs in styles that mix both (e.g. `pop()`).
- Signaling success or failure through a command's return value.

## Why it is a problem

- Ambiguity: the reader cannot tell whether a call inside an expression changes state.
- The query cannot be called without effects (in logs, debugging or assertions).
- More complex tests and temporal coupling.

## Example (smelly)

```python
class Inventory:
    def __init__(self):
        self._stock = {}

    def reserve(self, sku: str, qty: int) -> int:
        # SMELL: modifies the stock and returns what is left
        self._stock[sku] = self._stock.get(sku, 0) - qty
        return self._stock[sku]

if inventory.reserve("A-1", 2) < 0:   # query or command?
    ...
```

## Solution (refactored)

```python
class Inventory:
    def __init__(self):
        self._stock = {}

    def available(self, sku: str) -> int:          # query
        return self._stock.get(sku, 0)

    def reserve(self, sku: str, qty: int) -> None:  # command
        if qty > self.available(sku):
            raise InsufficientStock(sku)
        self._stock[sku] = self.available(sku) - qty

if inventory.available("A-1") >= 2:
    inventory.reserve("A-1", 2)
```

## Recommended refactorings

- **Separate Query from Modifier**: splits the function into a side-effect-free query and a command with no return value.
- **Replace Error Code with Exception**: the command signals failures with exceptions or explicit errors instead of its return value.
- **Change Function Declaration**: renames to make clear which is the command and which is the query.

## When it may be acceptable

- Atomic operations under concurrency, where separating query and command introduces race conditions (`ConcurrentDictionary.TryAdd`, `Interlocked.Increment`, `sync/atomic`, `pop()` on shared queues).
- Idiomatic language patterns: `TryXxx` in C#, `value, err` in Go, `dict.pop()` / `next()` in Python.
- Returning the generated identifier when creating an entity, a common pragmatic concession.

## Related smells

- [Side Effects](side-effects.md) — a query with side effects violates CQS.
- [Names Should Describe Side-Effects](../10-names/names-hiding-side-effects.md) — query names for functions that modify.
- [Output Arguments](output-arguments.md) — another way of mixing results and modifications.
- [Returning Error Codes](../08-error-handling/error-codes.md) — commands that return error codes.

## Automatic detection

| Language | Tools and rules |
|---|---|
| Python | No direct rule; review methods with query names that assign attributes. |
| C# | No direct rule; the `[Pure]` attribute documents queries, and SonarQube `S2201` / `CA1806` warn when the return value of methods that should be used is ignored. |
| React + TS | No direct rule; in React, renders that mutate state are exposed by `<StrictMode>`. |
| Go | No specific linter; review methods with query names that modify the receiver. |

CQS compliance depends on design intent, so it is verified mostly in code review.

## Implementations

Each folder contains the `smelly` version, the `refactored` version and the tests showing that both have the same observable behavior.

| Language | Folder |
|---|---|
| Python | [`python/code_smells/functions/command_query_violation/`](../../../python/code_smells/functions/command_query_violation/) |
| C# | [`csharp/src/CodeSmells/Functions/CommandQueryViolation/`](../../../csharp/src/CodeSmells/Functions/CommandQueryViolation/) |
| React + TS | [`react-ts/src/smells/functions/command-query-violation/`](../../../react-ts/src/smells/functions/command-query-violation/) |
| Go | [`go/smells/functions/command-query-violation/`](../../../go/smells/functions/command-query-violation/) |
| Angular | [`angular/src/smells/functions/command-query-violation/`](../../../angular/src/smells/functions/command-query-violation/) |

## References

- Martin, R. C. (2008). *Clean Code: A Handbook of Agile Software Craftsmanship*. Prentice Hall (chapter 17, "Smells and Heuristics").
- Jerzyk, M. and Madeyski, L. (2023). *Code Smells: A Comprehensive Online Catalog and Taxonomy*. Online catalog: https://codesmells.org
- Meyer, B. (1997). *Object-Oriented Software Construction* (2nd ed.). Prentice Hall.
- Fowler, M. — *CommandQuerySeparation* (bliki): https://martinfowler.com/bliki/CommandQuerySeparation.html
- Fowler, M. — *CodeSmell* (bliki): https://martinfowler.com/bliki/CodeSmell.html
