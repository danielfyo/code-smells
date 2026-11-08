# Fallacious Method Name

> **ID:** CS065 · **Category:** Names · **Sources:** Jerzyk 2023

*The name promises something different from what the method does (an isValid that modifies, a getX that returns something else).*

## Definition

A method name promises something different from what it does: `isValid()` that modifies the object,
`getItems()` that returns a count, `toList()` that returns an iterator, `calculateTotal()` that also sends an
email. Jerzyk and Madeyski describe it as *Fallacious Method Name*: the expectation set by the name (and by
prefix conventions such as `is`, `get`, `to`, `set`) does not match the actual behavior.

## Symptoms

- `is*`/`has*`/`can*` methods that do not return a boolean or that have side effects.
- `get*` methods that return something else (a number instead of a collection) or nothing at all.
- `to*`/`as*` converters that mutate the original.
- Plural names returning a single element and vice versa.

## Common causes

- The behavior changed and the name was not updated.
- Unawareness of the implicit conventions behind prefixes.
- Copying and pasting a method as a template and changing only the body.

## Why it is a problem

- **Bugs born of trust**: callers use the method according to what its name says.
- **Loss of trust** in every name in the codebase.
- Less effective code reviews, because reviewers read names, not implementations.

## Example (smelly)

```csharp
public class Order
{
    // SMELL: an "Is" that does more than ask: it also fixes the order
    public bool IsValid()
    {
        Lines.RemoveAll(l => l.Quantity == 0);
        return Lines.Count > 0;
    }

    // SMELL: "GetItems" returns a number
    public int GetItems() => Lines.Sum(l => l.Quantity);
}
```

## Solution (refactored)

```csharp
public class Order
{
    // REFACTOR: pure query with a question-style name
    public bool IsValid => Lines.Any(l => l.Quantity > 0);

    // REFACTOR: the side effect gets its own command-style method
    public void RemoveEmptyLines() => Lines.RemoveAll(l => l.Quantity == 0);

    // REFACTOR: the name describes what it returns
    public int TotalQuantity => Lines.Sum(l => l.Quantity);
}
```

## Recommended refactorings

- **Change Function Declaration** to align name and behavior.
- **Separate Query from Modifier** when a predicate modifies state.
- **Extract Function** for the part that does not match the name.

## When it may be acceptable

- A misleading name is never acceptable; at most it can be tolerated temporarily in public APIs that cannot break, marking the method as obsolete (`[Obsolete]`, `@deprecated`) and offering a well-named replacement.

## Related smells

- [Names Should Describe Side-Effects](names-hiding-side-effects.md): a particular case: the name omits the side effect.
- [Obvious Behavior Is Unimplemented](../11-general/obvious-behavior-unimplemented.md): the function does not do what anyone would expect.
- [Obsolete Comment](../09-comments/obsolete-comment.md): the same phenomenon in a comment.
- [Command-Query Separation Violation](../07-functions/command-query-violation.md): predicates that also modify.
- [Ambiguous Name](ambiguous-name.md): ambiguity versus falsehood.

## Automatic detection

- **Python**: Pylint `R1710` (`inconsistent-return-statements`) and type checkers (mypy/Pyright) help when the annotated type contradicts usage; there are no rules for name semantics.
- **C#**: `CA1024` (use properties where appropriate) and review of `Is*`/`Get*` methods that return `void` or mutate state.
- **TypeScript**: `@typescript-eslint/naming-convention` can require boolean variables to start with `is`/`has`/`should`, which makes inconsistencies obvious.
- **Go**: manual review; `revive` does not evaluate name semantics.

## Implementations

- Python: [`python/code_smells/names/fallacious_method_name/`](../../../python/code_smells/names/fallacious_method_name/)
- C#: [`csharp/src/CodeSmells/Names/FallaciousMethodName/`](../../../csharp/src/CodeSmells/Names/FallaciousMethodName/)
- React + TS: [`react-ts/src/smells/names/fallacious-method-name/`](../../../react-ts/src/smells/names/fallacious-method-name/)
- Go: [`go/smells/names/fallacious-method-name/`](../../../go/smells/names/fallacious-method-name/)

Each folder contains a `smelly` version (the smell, marked with `SMELL:` comments) and a `refactored` version (marked with `REFACTOR:` comments), plus tests showing that both have the same observable behavior.

## References

- Jerzyk, M. and Madeyski, L. (2023). "Code Smells: A Comprehensive Online Catalog and Taxonomy". Online catalog: https://codesmells.org
- Martin, R. C. (2008). *Clean Code*, ch. 17 "Smells and Heuristics". Prentice Hall.
- Fowler, M. (2018). *Refactoring: Improving the Design of Existing Code* (2nd ed.). Addison-Wesley. Refactoring catalog: https://refactoring.com/catalog/
