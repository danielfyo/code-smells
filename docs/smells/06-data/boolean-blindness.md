# Boolean Blindness

> **ID:** CS034 · **Category:** Data Dealers · **Sources:** Jerzyk 2023; Harper
>
> Booleans that lose the meaning of what they represent, making calls like f(true, false) unreadable.

## Definition

**Boolean blindness**, a term coined by Robert Harper, describes the loss of information that happens
when a result or an argument is reduced to `true`/`false`: the boolean does not say **what** is true. A
call such as `create_user(name, True, False)` is unreadable without opening the definition, and a
function returning `bool` forces the caller to remember what each value meant.

Jerzyk and Madeyski's catalog lists it as a data smell: booleans should be replaced with types that
preserve meaning (enumerations, sum types, result objects).

## Symptoms

- Calls with positional boolean literals: `f(true, false, true)`.
- Several related booleans that represent a state (`isDraft`, `isPublished`, `isArchived`).
- Functions returning `bool` that force the caller to check afterwards why it failed.
- Combinations of booleans representing impossible states.

## Common causes

- The boolean is the simplest type available and seems sufficient at first.
- Adding "one more boolean" for each new variant.
- Languages without convenient sum types (although all languages in this repository offer enumerations).

## Why it is a problem

- Unreadable, error-prone calls (swapping two booleans).
- Representable impossible states (`isDraft && isPublished`).
- Extending to a third state forces you to change the type and every usage.

## Example (smelly)

```csharp
public class Document
{
    public bool IsDraft { get; set; }
    public bool IsPublished { get; set; }   // what if both are true?
}

public void Export(Document doc, bool pdf, bool includeComments) { /* ... */ }

Export(doc, true, false);   // what does each value mean?
```

## Solution (refactored)

```csharp
public enum DocumentStatus { Draft, Published, Archived }

public class Document
{
    public DocumentStatus Status { get; set; }
}

public enum ExportFormat { Pdf, Html }
public enum CommentsMode { Exclude, Include }

public void Export(Document doc, ExportFormat format, CommentsMode comments) { /* ... */ }

Export(doc, ExportFormat.Pdf, CommentsMode.Exclude);
```

Impossible states disappear and every call reads without looking up the definition.

## Recommended refactorings

- **Remove Flag Argument**: replaces the boolean with explicit functions.
- **Replace Primitive with Object**: or with an enumeration that names each state.
- **Replace Type Code with Subclasses**: if each state implies different behavior.
- **Introduce Parameter Object**: to group named options.

## When it may be acceptable

- Genuine predicates with a clear name (`isEmpty()`, `hasPermission(user)`), where the meaning lives in the function name.
- Named arguments at the call site (`export(doc, pdf=True)` in Python, named arguments in C#) mitigate the unreadability, though not the impossible states.

## Related smells

- [Flag / Selector Arguments](../07-functions/flag-arguments.md) — flag arguments are the most common case of boolean blindness.
- [Primitive Obsession](../01-bloaters/primitive-obsession.md) — the boolean is a primitive used for a concept with more nuance.
- [Status Variable](status-variable.md) — booleans that drive control flow.
- [Boolean Props Explosion](../16-react-ts/boolean-prop-explosion.md) — React component variant.
- [Long Parameter List](../01-bloaters/long-parameter-list.md) — several booleans lengthen signatures.

## Automatic detection

| Language | Tools and rules |
|---|---|
| Python | Ruff `FBT001` (boolean positional parameter), `FBT002` (boolean default value) and `FBT003` (boolean positional value in a call). |
| C# | No standard Roslyn rule; review signatures with several `bool` parameters as a hint. |
| React + TS | No standard ESLint rule; `@typescript-eslint/switch-exhaustiveness-check` helps once booleans are replaced with unions. |
| Go | revive `flag-parameter` (boolean control parameters). |

## Implementations

Each folder contains the `smelly` version, the `refactored` version and the tests showing that both have the same observable behavior.

| Language | Folder |
|---|---|
| Python | [`python/code_smells/data/boolean_blindness/`](../../../python/code_smells/data/boolean_blindness/) |
| C# | [`csharp/src/CodeSmells/Data/BooleanBlindness/`](../../../csharp/src/CodeSmells/Data/BooleanBlindness/) |
| React + TS | [`react-ts/src/smells/data/boolean-blindness/`](../../../react-ts/src/smells/data/boolean-blindness/) |
| Go | [`go/smells/data/boolean-blindness/`](../../../go/smells/data/boolean-blindness/) |

## References

- Jerzyk, M. and Madeyski, L. (2023). *Code Smells: A Comprehensive Online Catalog and Taxonomy*. Online catalog: https://codesmells.org
- Harper, R. (2011). "Boolean Blindness". Post on the *Existential Type* blog.
- Fowler, M. — *CodeSmell* (bliki): https://martinfowler.com/bliki/CodeSmell.html
