# String Concatenation in Loops

> **ID:** CS118 · **Category:** C#/.NET-specific · **Sources:** Microsoft Docs

## Definition

A string is built by accumulating fragments with `+=` inside a loop. Because `System.String` is immutable, each
concatenation creates a **new object** and copies all the previous content: with n iterations, O(n²) characters are
copied and n temporary objects are produced for the garbage collector.

## Symptoms

- `string csv = "";` followed by a `foreach` with `csv += ...`.
- Report, CSV, HTML or SQL generation that slows down with thousands of rows.
- Allocation spikes and frequent Gen0 collections in the profiler.
- Separators added by hand and then removed with `TrimEnd(',')` or `Substring`.

## Common causes

- It is the most obvious way to write it and works with a few items.
- Code that started out processing ten rows and now processes a hundred thousand.
- Not knowing `StringBuilder`, `string.Join` or `string.Concat`.

## Why it is a problem

- **Quadratic performance** in time and memory.
- **GC pressure**: thousands of intermediate strings; large ones (over 85,000 bytes) go to the Large Object Heap,
  which is rarely compacted and only collected with Gen2.
- **Readability**: separator and formatting logic is mixed with iteration.

## How it works under the hood

`string` is an **immutable** reference type. The compiler translates `a + b + c` into **one** call to
`string.Concat(a, b, c)`, which computes the final length and copies once; that is why concatenating several pieces
in a single expression is efficient. In a loop, however, each `s += x` is an independent call to
`string.Concat(s, x)` that allocates a string of length `s.Length + x.Length` and copies both: the total copying
grows quadratically. `StringBuilder` keeps a mutable buffer (a list of *chunks*) that grows in an amortized way and
only materializes the final string when `ToString()` is called. Interpolated strings in C# 10+ use
`DefaultInterpolatedStringHandler`, which avoids intermediate allocations within a single expression, but does not
change the cost of accumulating in a loop.

## Example (smelly)

```csharp
public static string ToCsv(IEnumerable<Order> orders)
{
    string csv = "Id;Customer;Total\n";
    foreach (var order in orders)
    {
        // SMELL: each += creates a new string and copies everything before it
        csv += order.Id + ";" + order.Customer + ";" + order.Total.ToString("F2") + "\n";
    }
    return csv;
}

public static string Tags(IEnumerable<string> tags)
{
    string result = "";
    foreach (var tag in tags) result += tag + ", ";
    return result.TrimEnd(',', ' ');   // SMELL: patch for the separator
}
```

## Solution (refactored)

```csharp
public static string ToCsv(IEnumerable<Order> orders)
{
    // REFACTOR: a single mutable buffer; the final string is created once
    var sb = new StringBuilder("Id;Customer;Total\n");
    foreach (var order in orders)
    {
        sb.Append(order.Id).Append(';')
          .Append(order.Customer).Append(';')
          .Append(order.Total.ToString("F2", CultureInfo.InvariantCulture)).Append('\n');
    }
    return sb.ToString();
}

public static string Tags(IEnumerable<string> tags) => string.Join(", ", tags);
```

## Recommended refactorings

- **`StringBuilder`** for incremental construction, with an initial capacity if the size is known.
- **`string.Join`** / **`string.Concat`** to join collections.
- **Write directly to the destination** (`StreamWriter`, `TextWriter`, `PipeWriter`) when the result goes to a file
  or the network, without building the whole string in memory.
- Use dedicated libraries (CsvHelper, serializers, template engines) for structured formats.

## When it may be acceptable

- Loops with a small, bounded number of iterations (say 3-5) where clarity wins.
- Single-expression concatenation outside loops: the compiler already optimizes it with `string.Concat`.

## Related smells

- [String Concatenation in Loop (Python)](../14-python/string-concatenation-in-loop.md)
- [Loops / Imperative Loops](../06-data/loops.md)
- [Side Effects in LINQ](linq-side-effects.md)

## Automatic detection

- **SonarAnalyzer for C#**: rule `S1643` ("Strings should not be concatenated using '+' in a loop").
- **.NET analyzers** related to `StringBuilder`: `CA1834` (use `Append(char)` for single-character strings) and
  `CA1830` (prefer strongly-typed `Append` overloads).
- Memory profilers (Visual Studio, dotMemory, `dotnet-trace`) show the `String` allocations.

## Implementations

- C#: [`csharp/src/CodeSmells/CsharpSpecific/StringConcatInLoop/`](../../../csharp/src/CodeSmells/CsharpSpecific/StringConcatInLoop/)

C#/.NET-specific smell: there is no implementation in the other languages of the repository.

## References

- Microsoft Learn, *Using the StringBuilder class in .NET*:
  https://learn.microsoft.com/dotnet/standard/base-types/stringbuilder
- Microsoft Learn, *How to concatenate multiple strings*:
  https://learn.microsoft.com/dotnet/csharp/how-to/concatenate-multiple-strings
- Microsoft Learn, `System.String` (immutability): https://learn.microsoft.com/dotnet/api/system.string
