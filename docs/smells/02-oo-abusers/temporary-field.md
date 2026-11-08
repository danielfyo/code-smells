# Temporary Field

> **ID:** CS007 · **Category:** Object-Orientation Abusers · **Sources:** Fowler 1999
>
> Fields that only hold a value in certain circumstances and are empty the rest of the time.

## Definition

A **temporary field** is a class attribute that only holds a meaningful value during part of the
object's lifecycle (for example, while a particular algorithm runs) and is empty, `null` or set to a
sentinel value the rest of the time.

Readers expect all of a class's fields to be relevant at all times. Discovering that a field only holds
something between the call to `start()` and the call to `finish()` requires studying the whole flow of
the class.

## Symptoms

- Fields initialized to `None`/`null` in the constructor and assigned in only one method.
- `if self._x is not None` checks scattered across the class.
- Fields used to pass data between private methods instead of using parameters.
- Fields that only make sense for one kind of object (e.g. `discount_code` only on promotional orders).

## Common causes

- Avoiding long parameter lists by storing intermediate values in the object.
- Complex algorithms implemented as methods of a class they do not belong to.
- Modeling optional cases with optional fields instead of with distinct types.

## Why it is a problem

- The valid state of the object is not obvious; errors appear from uninitialized fields.
- Methods stop being reentrant and thread-safe.
- The class loses cohesion and grows unnecessarily.

## Example (smelly)

```csharp
public class RouteCalculator
{
    // SMELL: only meaningful while Calculate() runs
    private List<Stop>? _pending;
    private decimal _distance;

    public decimal Calculate(IEnumerable<Stop> stops)
    {
        _pending = stops.ToList();
        _distance = 0;
        while (_pending.Count > 1) AdvanceToNearest();
        return _distance;
    }

    private void AdvanceToNearest() { /* reads and writes _pending and _distance */ }
}
```

## Solution (refactored)

```csharp
public class RouteCalculator
{
    public decimal Calculate(IEnumerable<Stop> stops) => new RouteRun(stops).Execute();

    // REFACTOR: the temporary state lives in an object with its own lifecycle
    private sealed class RouteRun
    {
        private readonly List<Stop> _pending;
        private decimal _distance;

        public RouteRun(IEnumerable<Stop> stops) => _pending = stops.ToList();

        public decimal Execute()
        {
            while (_pending.Count > 1) AdvanceToNearest();
            return _distance;
        }

        private void AdvanceToNearest() { /* ... */ }
    }
}
```

## Recommended refactorings

- **Extract Class**: moves the temporary fields and the code that uses them into a class of their own.
- **Replace Function with Command**: the algorithm becomes an object whose state lives only for the duration of the run.
- **Introduce Special Case**: replaces null checks with an object that has default behavior.
- **Replace Type Code with Subclasses**: when the field only applies to one kind of object.

## When it may be acceptable

- Encapsulated lazy caches, where an empty field means "not computed yet" and nobody outside observes it.
- Short-lived objects explicitly designed as "one run of an algorithm" (precisely the proposed solution).

## Related smells

- [Hidden Temporal Coupling](../05-couplers/hidden-temporal-coupling.md) — temporary fields force methods to be called in a specific order.
- [Null Check / Null Abuse](../06-data/null-abuse.md) — temporary fields usually come with null checks.
- [Large Class / God Class](../01-bloaters/large-class.md) — they add unnecessary state to the class.
- [Long Parameter List](../01-bloaters/long-parameter-list.md) — they are often introduced to avoid passing parameters.
- [Output Arguments](../07-functions/output-arguments.md) — another way of communicating results through the back door.

## Automatic detection

| Language | Tools and rules |
|---|---|
| Python | Pylint `W0201 attribute-defined-outside-init` detects attributes created outside `__init__`; mypy/pyright flag unchecked access to `Optional` attributes. |
| C# | With `<Nullable>enable</Nullable>`, warnings `CS8618`/`CS8602` reveal fields that may not be initialized; `IDE0044` (make field `readonly`) flags those that should never change. |
| React + TS | `strictPropertyInitialization` and `strictNullChecks` in `tsconfig`; `@typescript-eslint/no-non-null-assertion` reveals forced access. |
| Go | No specific rule; review struct fields that are only assigned in one method. |

## Implementations

Each folder contains the `smelly` version, the `refactored` version and the tests showing that both have the same observable behavior.

| Language | Folder |
|---|---|
| Python | [`python/code_smells/oo_abusers/temporary_field/`](../../../python/code_smells/oo_abusers/temporary_field/) |
| C# | [`csharp/src/CodeSmells/OoAbusers/TemporaryField/`](../../../csharp/src/CodeSmells/OoAbusers/TemporaryField/) |
| React + TS | [`react-ts/src/smells/oo_abusers/temporary-field/`](../../../react-ts/src/smells/oo_abusers/temporary-field/) |
| Go | [`go/smells/oo_abusers/temporary-field/`](../../../go/smells/oo_abusers/temporary-field/) |
| Angular | [`angular/src/smells/oo_abusers/temporary-field/`](../../../angular/src/smells/oo_abusers/temporary-field/) |

## References

- Fowler, M. (1999). *Refactoring: Improving the Design of Existing Code*. Addison-Wesley (chapter 3, "Bad Smells in Code", written with Kent Beck).
- Fowler, M. (2018). *Refactoring: Improving the Design of Existing Code* (2nd ed.). Addison-Wesley. Refactoring catalog: https://refactoring.com/catalog/
- Mäntylä, M. V. and Lassenius, C. (2006). "Subjective evaluation of software evolvability using code smells: An empirical study". *Empirical Software Engineering*, 11(3), 395-431.
- Jerzyk, M. and Madeyski, L. (2023). *Code Smells: A Comprehensive Online Catalog and Taxonomy*. Online catalog: https://codesmells.org
- Refactoring.Guru — Temporary Field: https://refactoring.guru/smells/temporary-field
- Refactoring.Guru — Code Smells: https://refactoring.guru/refactoring/smells
- Fowler, M. — *CodeSmell* (bliki): https://martinfowler.com/bliki/CodeSmell.html
