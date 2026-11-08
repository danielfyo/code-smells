# Oddball Solution

> **ID:** CS077 · **Category:** General · **Sources:** Kerievsky 2004; Jerzyk 2023

*The same problem is solved in different ways in different parts of the system.*

## Definition

The same problem is solved in different ways in different parts of the system: one part formats dates with a
library and another by hand; some modules use an HTTP client with retries and others do not. Kerievsky
(*Refactoring to Patterns*) describes it as *Oddball Solution*: there is usually a preferred solution and one
or more "oddball" ones worth unifying. Jerzyk and Madeyski include it in their catalog.

## Symptoms

- Several utility functions doing the same thing under different names.
- Mixed patterns for the same task (callbacks, promises and `async/await` to access the same API).
- Different error, log or validation formats depending on the module.
- Bug fixes applied to one implementation but not to the others.

## Common causes

- Developers who did not know about the existing solution.
- No internal library or architecture guide.
- Half-finished migrations from one technology to another.

## Why it is a problem

- **Duplicated effort** and duplicated bugs.
- **Inconsistent behavior** for users (different date formats, different errors).
- A steeper learning curve: every variant has to be known.

## Example (smelly)

```typescript
// checkout.ts
const label = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;

// invoices.ts
const label = d.toISOString().slice(0, 10);

// orders.ts
const label = new Intl.DateTimeFormat("en-US").format(d);
// SMELL: three solutions to the same problem (with subtly different results)
```

## Solution (refactored)

```typescript
// shared/format.ts
const dateFormatter = new Intl.DateTimeFormat("en-US", { day: "2-digit", month: "2-digit", year: "numeric" });

// REFACTOR: a single shared solution
export function formatDate(date: Date): string {
  return dateFormatter.format(date);
}

// checkout.ts, invoices.ts, orders.ts
const label = formatDate(d);
```

## Recommended refactorings

- **Substitute Algorithm** to converge on the preferred solution.
- **Extract Function** / **Move Function** into a shared module.
- In Kerievsky's catalog, **Unify Interfaces with Adapter** when the solutions have different APIs.

## When it may be acceptable

- Migrations in progress, with an explicit plan to retire the old solution.
- Genuinely different requirements that justify different solutions (documented).

## Related smells

- [Duplicate Code](../04-dispensables/duplicate-code.md): duplication in different shapes.
- [Inconsistent Names](../10-names/inconsistent-names.md): the same inconsistency applied to names.
- [Alternative Classes with Different Interfaces](../02-oo-abusers/alternative-classes-different-interfaces.md): equivalent classes with different interfaces.
- [Reinventing the Standard Library](../14-python/reinventing-stdlib.md): a home-grown solution versus the standard library's.
- [Non-Standard Nomenclature](../10-names/non-standard-nomenclature.md): ignoring the standard way.

## Automatic detection

- **Duplicate detectors**: SonarQube, Pylint `R0801`, `jscpd`, `dupl` in golangci-lint (they find some of the variants).
- **Usage restrictions**: ESLint `no-restricted-imports`/`no-restricted-syntax`, `depguard`/`forbidigo` in Go, `BannedApiAnalyzers` in .NET and Ruff `TID251` (banned-api) enforce the chosen solution.

## Implementations

- Python: [`python/code_smells/general/oddball_solution/`](../../../python/code_smells/general/oddball_solution/)
- C#: [`csharp/src/CodeSmells/General/OddballSolution/`](../../../csharp/src/CodeSmells/General/OddballSolution/)
- React + TS: [`react-ts/src/smells/general/oddball-solution/`](../../../react-ts/src/smells/general/oddball-solution/)
- Go: [`go/smells/general/oddball-solution/`](../../../go/smells/general/oddball-solution/)

Each folder contains a `smelly` version (the smell, marked with `SMELL:` comments) and a `refactored` version (marked with `REFACTOR:` comments), plus tests showing that both have the same observable behavior.

## References

- Kerievsky, J. (2004). *Refactoring to Patterns*. Addison-Wesley.
- Jerzyk, M. and Madeyski, L. (2023). "Code Smells: A Comprehensive Online Catalog and Taxonomy". Online catalog: https://codesmells.org
- Fowler, M. (2018). *Refactoring: Improving the Design of Existing Code* (2nd ed.). Addison-Wesley. Refactoring catalog: https://refactoring.com/catalog/
