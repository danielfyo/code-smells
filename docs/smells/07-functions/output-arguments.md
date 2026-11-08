# Output Arguments

> **ID:** CS038 · **Category:** Functions & Conditional Logic · **Sources:** Clean Code F2
>
> Parameters that the function modifies to return results, instead of using the return value.

## Definition

**Output arguments** are parameters that a function modifies to communicate its result instead of
returning it. *Clean Code* (F2) discourages them: readers expect arguments to be **inputs**, and
discovering that `append_footer(report)` modifies `report` (or that `parse(text, result)` fills in
`result`) forces them to reread the call.

In object-oriented code, if a function must change the state of something, it is more natural for it to
change the state of the object it is called on (`report.append_footer()`), or to return a new value.

## Symptoms

- `void` functions (or functions without a return value) that modify received lists, dictionaries or objects.
- `out`/`ref` parameters in C# outside the `TryXxx` pattern.
- Pointers passed in Go only to "return" results through them.
- Calls where a variable is declared empty right before so the function can fill it.

## Common causes

- Habits from C, where returning several values was awkward.
- Trying to avoid copies for performance.
- Functions that need to return several results without a type created for them.

## Why it is a problem

- The call does not reveal that the argument changes: surprises for the reader.
- It hinders function composition and an immutable style.
- Aliasing bugs when the same object is used elsewhere.

## Example (smelly)

```csharp
public void CalculateTotals(List<OrderLine> lines, out decimal net, out decimal vat)
{
    net = lines.Sum(l => l.Price * l.Quantity);
    vat = net * 0.21m;
}

CalculateTotals(lines, out var net, out var vat);
```

## Solution (refactored)

```csharp
public readonly record struct Totals(decimal Net, decimal Vat)
{
    public decimal Gross => Net + Vat;
}

public Totals CalculateTotals(IEnumerable<OrderLine> lines)
{
    var net = lines.Sum(l => l.Price * l.Quantity);
    return new Totals(net, net * VatRate);
}

var totals = CalculateTotals(lines);
```

## Recommended refactorings

- **Separate Query from Modifier**: the function returns the result instead of writing it into an argument.
- **Introduce Parameter Object**: or a result object, when several values must be returned.
- **Move Function**: if it must change an object's state, make it a method of that object.
- **Remove Assignments to Parameters**: from Fowler's first edition (in 2018, part of *Split Variable*).

## When it may be acceptable

- The `TryParse(string, out T)` pattern in C#, idiomatic and recognizable.
- Go: functions such as `json.Unmarshal(data, &v)` or `io.Reader.Read(p []byte)`, where the output buffer is part of the contract to avoid allocations.
- Performance-critical paths where reusing a buffer makes a measurable difference.

## Related smells

- [Side Effects](side-effects.md) — modifying an argument is a side effect.
- [Mutable Data](../06-data/mutable-data.md) — output arguments rely on mutable data.
- [Command-Query Separation Violation](command-query-violation.md) — functions that modify and return at the same time.
- [Temporary Field](../02-oo-abusers/temporary-field.md) — another way of communicating results through indirect channels.

## Automatic detection

| Language | Tools and rules |
|---|---|
| Python | No direct rule; review functions that mutate their parameters (Pylint `W0102` covers the related case of mutable default values). |
| C# | `CA1021` (avoid `out` parameters) and `CA1045` (do not pass types by reference). |
| React + TS | ESLint `no-param-reassign` with the `{ props: true }` option detects modifications of parameter properties. |
| Go | revive `modifies-parameter`; gocritic `ptrToRefParam` (pointers to types that are already references). |

## Implementations

Each folder contains the `smelly` version, the `refactored` version and the tests showing that both have the same observable behavior.

| Language | Folder |
|---|---|
| Python | [`python/code_smells/functions/output_arguments/`](../../../python/code_smells/functions/output_arguments/) |
| C# | [`csharp/src/CodeSmells/Functions/OutputArguments/`](../../../csharp/src/CodeSmells/Functions/OutputArguments/) |
| React + TS | [`react-ts/src/smells/functions/output-arguments/`](../../../react-ts/src/smells/functions/output-arguments/) |
| Go | [`go/smells/functions/output-arguments/`](../../../go/smells/functions/output-arguments/) |

## References

- Martin, R. C. (2008). *Clean Code: A Handbook of Agile Software Craftsmanship*. Prentice Hall (chapter 17, "Smells and Heuristics").
- Jerzyk, M. and Madeyski, L. (2023). *Code Smells: A Comprehensive Online Catalog and Taxonomy*. Online catalog: https://codesmells.org
- Fowler, M. — *CodeSmell* (bliki): https://martinfowler.com/bliki/CodeSmell.html
