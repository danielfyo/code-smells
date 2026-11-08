# Status Variable

> **ID:** CS036 · **Category:** Data Dealers · **Sources:** Jerzyk 2023
>
> Mutable flag variables used to control the flow of loops or functions.

## Definition

A **status variable** (Jerzyk and Madeyski's catalog) is a mutable flag (`found`, `done`, `ok`, `error`)
that is initialized before a loop or block, modified inside it and checked afterwards to decide the flow.
It is a legacy of strict structured programming ("a single exit per function") that forces the reader to
track the flag's value throughout the code.

It can almost always be replaced by an early `return` or `break`, a standard library search function or
an exception.

## Symptoms

- Variables `found = False`, `done = false`, `success := true` before a loop.
- Loop conditions such as `while not done and i < len(items)`.
- Checks of the flag after the loop to decide what to return.
- Several flags interacting with each other.

## Common causes

- The "single return point" rule.
- Not knowing functions such as `any`, `next`, `Find`, `some`, `slices.ContainsFunc`.
- Code that evolved by adding cases to an existing loop.

## Why it is a problem

- The real flow is hidden behind the flag's state.
- Loops that keep iterating needlessly.
- It is easy to forget to update or check the flag on some path.

## Example (smelly)

```csharp
public Product? FindFirstOutOfStock(List<Product> products)
{
    bool found = false;
    Product? result = null;
    int i = 0;
    while (!found && i < products.Count)
    {
        if (products[i].Stock == 0)
        {
            result = products[i];
            found = true;
        }
        i++;
    }
    return found ? result : null;
}
```

## Solution (refactored)

```csharp
public Product? FindFirstOutOfStock(IEnumerable<Product> products) =>
    products.FirstOrDefault(p => p.Stock == 0);
```

When no suitable library function exists, a `return` inside the loop is equally clear.

## Recommended refactorings

- **Replace Control Flag with Break**: replaces the flag with `return`, `break` or `continue` (in the first edition, *Remove Control Flag*).
- **Replace Loop with Pipeline**: uses collection operations (`any`, `FirstOrDefault`, `find`).
- **Replace Nested Conditional with Guard Clauses**: early exits instead of error flags.
- **Extract Function**: isolates the search loop so it can return as soon as the result is found.

## When it may be acceptable

- Explicit state machines, where the variable represents a domain state rather than a control flag.
- Loops that must finish some work (e.g. releasing resources) even after the target has been found.

## Related smells

- [Loops / Imperative Loops](loops.md) — many flags disappear when collection pipelines are used.
- [Boolean Blindness](boolean-blindness.md) — flags are booleans without explicit meaning.
- [Deep Nesting / Arrow Code](../07-functions/deep-nesting.md) — flags often accompany nested conditionals.
- [Mutable Data](mutable-data.md) — a flag is mutable local state.

## Automatic detection

| Language | Tools and rules |
|---|---|
| Python | No direct rule; Ruff `SIM110` suggests `any()`/`all()` instead of loops returning booleans. |
| C# | No standard rule; SonarQube `S1854` (dead stores) and `S3776` (cognitive complexity) as hints. |
| React + TS | `unicorn/no-for-loop`, `unicorn/prefer-array-some` and `unicorn/prefer-array-find` (eslint-plugin-unicorn). |
| Go | No specific linter; `slices.ContainsFunc` and `slices.IndexFunc` (Go 1.21+) cover most searches. |

## Implementations

Each folder contains the `smelly` version, the `refactored` version and the tests showing that both have the same observable behavior.

| Language | Folder |
|---|---|
| Python | [`python/code_smells/data/status_variable/`](../../../python/code_smells/data/status_variable/) |
| C# | [`csharp/src/CodeSmells/Data/StatusVariable/`](../../../csharp/src/CodeSmells/Data/StatusVariable/) |
| React + TS | [`react-ts/src/smells/data/status-variable/`](../../../react-ts/src/smells/data/status-variable/) |
| Go | [`go/smells/data/status-variable/`](../../../go/smells/data/status-variable/) |

## References

- Jerzyk, M. and Madeyski, L. (2023). *Code Smells: A Comprehensive Online Catalog and Taxonomy*. Online catalog: https://codesmells.org
- Fowler, M. — *CodeSmell* (bliki): https://martinfowler.com/bliki/CodeSmell.html
