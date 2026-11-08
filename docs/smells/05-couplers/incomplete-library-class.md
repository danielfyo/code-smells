# Incomplete Library Class

> **ID:** CS027 · **Category:** Couplers · **Sources:** Fowler 1999
>
> A library does not offer what you need and the extension logic ends up scattered across the code.

## Definition

An **incomplete library class** appears when a third-party library does not offer an operation you need
and you cannot modify it. The smell is not the library itself but what the code does to compensate: the
extension logic ends up scattered throughout the project, duplicated in loose helper functions and mixed
with business logic.

The solution is to concentrate that extension in a single, clearly named place: extension methods,
wrappers or adapters.

## Symptoms

- The same sequence of library calls repeated in several places.
- Loose helper functions that "complete" an external type (`utils.parse_money(s)`).
- Business code full of details of the library's API.

## Common causes

- Libraries cannot anticipate every need.
- Using the library directly everywhere without a layer of your own.
- Not knowing the language's extension mechanisms.

## Why it is a problem

- Duplication and inconsistent behavior across copies.
- Migrating or upgrading the library requires touching all the code.
- Business intent is hidden among low-level calls.

## Example (smelly)

```csharp
// SMELL: the same "last business day of the month" logic repeated in several services
var last = new DateOnly(d.Year, d.Month, DateTime.DaysInMonth(d.Year, d.Month));
while (last.DayOfWeek is DayOfWeek.Saturday or DayOfWeek.Sunday)
    last = last.AddDays(-1);
```

## Solution (refactored)

```csharp
public static class DateOnlyExtensions
{
    // REFACTOR: Introduce Foreign Method as an extension method
    public static DateOnly LastBusinessDayOfMonth(this DateOnly d)
    {
        var last = new DateOnly(d.Year, d.Month, DateTime.DaysInMonth(d.Year, d.Month));
        while (last.DayOfWeek is DayOfWeek.Saturday or DayOfWeek.Sunday)
            last = last.AddDays(-1);
        return last;
    }
}

var dueDate = invoice.IssuedOn.LastBusinessDayOfMonth();
```

## Recommended refactorings

- **Introduce Foreign Method**: from Fowler's first edition: a function of your own that receives the external instance (extension methods in C#, methods on your own types in Go).
- **Introduce Local Extension**: from the first edition: a subclass or wrapper that adds the missing operations.
- **Extract Function**: and **Move Function**: concentrate the repeated logic in an extension module.

## When it may be acceptable

- A single one-off use: creating an extension for one call can be overkill.
- When the missing functionality will soon be contributed to the original library (upstream).

## Related smells

- [Duplicate Code](../04-dispensables/duplicate-code.md) — the workarounds get duplicated across the code.
- [Alternative Classes with Different Interfaces](../02-oo-abusers/alternative-classes-different-interfaces.md) — adapting different libraries to a common interface.
- [Reinventing the Standard Library](../14-python/reinventing-stdlib.md) — the opposite: reimplementing what the library does offer.
- [utils / common Packages](../17-go/utils-package.md) — in Go, `utils` packages tend to accumulate these extensions without cohesion.

## Automatic detection

| Language | Tools and rules |
|---|---|
| Python | Pylint `R0801 duplicate-code` for repeated call sequences. |
| C# | SonarQube duplication detection. |
| React + TS | `jscpd`. |
| Go | golangci-lint `dupl`. |

There are no specific rules: tools only detect the duplication the smell produces.

## Implementations

Each folder contains the `smelly` version, the `refactored` version and the tests showing that both have the same observable behavior.

| Language | Folder |
|---|---|
| Python | [`python/code_smells/couplers/incomplete_library_class/`](../../../python/code_smells/couplers/incomplete_library_class/) |
| C# | [`csharp/src/CodeSmells/Couplers/IncompleteLibraryClass/`](../../../csharp/src/CodeSmells/Couplers/IncompleteLibraryClass/) |
| React + TS | [`react-ts/src/smells/couplers/incomplete-library-class/`](../../../react-ts/src/smells/couplers/incomplete-library-class/) |
| Go | [`go/smells/couplers/incomplete-library-class/`](../../../go/smells/couplers/incomplete-library-class/) |

## References

- Fowler, M. (1999). *Refactoring: Improving the Design of Existing Code*. Addison-Wesley (chapter 3, "Bad Smells in Code", written with Kent Beck).
- Fowler, M. (2018). *Refactoring: Improving the Design of Existing Code* (2nd ed.). Addison-Wesley. Refactoring catalog: https://refactoring.com/catalog/
- Mäntylä, M. V. and Lassenius, C. (2006). "Subjective evaluation of software evolvability using code smells: An empirical study". *Empirical Software Engineering*, 11(3), 395-431.
- Jerzyk, M. and Madeyski, L. (2023). *Code Smells: A Comprehensive Online Catalog and Taxonomy*. Online catalog: https://codesmells.org
- Refactoring.Guru — Incomplete Library Class: https://refactoring.guru/smells/incomplete-library-class
- Refactoring.Guru — Code Smells: https://refactoring.guru/refactoring/smells
- Fowler, M. — *CodeSmell* (bliki): https://martinfowler.com/bliki/CodeSmell.html
