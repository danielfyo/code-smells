# Flag / Selector Arguments

> **ID:** CS039 · **Category:** Functions & Conditional Logic · **Sources:** Clean Code F3/G15
>
> A boolean or enum that makes the function do different things: it is really several functions.

## Definition

A **flag argument** is a boolean parameter (or a selector enum/string) that makes the function behave
differently depending on its value. *Clean Code* (F3) is blunt: passing a boolean into a function is a
truly terrible practice, because it loudly proclaims that the function does more than one thing; G15
extends the criticism to selector arguments in general. Fowler (*FlagArgument*) proposes replacing them
with explicit functions.

At the call site, `render(page, true)` says nothing; `render_for_print(page)` says everything.

## Symptoms

- `bool` parameters checked with an `if` at the start of the function.
- Calls with boolean literals or mode strings (`"full"`, `"summary"`).
- The function body splits into two almost independent blocks depending on the flag.
- Several combined flags that multiply the paths.

## Common causes

- Reusing an existing function for a similar case by adding a parameter.
- Avoiding new functions out of laziness or fear of duplication.

## Why it is a problem

- Unreadable calls (boolean blindness).
- The function does several things and violates the single responsibility principle.
- Combinations of flags produce paths that are hard to test.

## Example (smelly)

```python
def book_room(guest, room, premium):
    if premium:
        room.add_amenity("minibar")
        price = room.base_price * 1.5
    else:
        price = room.base_price
    return Booking(guest, room, price)

book_room(guest, room, True)
```

## Solution (refactored)

```python
def book_standard_room(guest, room):
    return Booking(guest, room, room.base_price)

def book_premium_room(guest, room):
    room.add_amenity("minibar")
    return Booking(guest, room, room.base_price * PREMIUM_MULTIPLIER)

book_premium_room(guest, room)
```

## Recommended refactorings

- **Remove Flag Argument**: creates an explicit function for each value of the flag (formerly *Replace Parameter with Explicit Methods*).
- **Decompose Conditional**: extracts each branch into a named function.
- **Replace Conditional with Polymorphism**: if the flag selects behavior that also appears elsewhere.

## When it may be acceptable

- When the flag is data forwarded from elsewhere (configuration, user input) rather than a literal in the code: separate functions would force the caller to write the `if`.
- APIs with mandatory keyword arguments (`*, dry_run: bool` in Python) where the call remains readable.
- Minor presentation options that do not change the main behavior.

## Related smells

- [Boolean Blindness](../06-data/boolean-blindness.md) — calls with boolean literals lose their meaning.
- [Long Parameter List](../01-bloaters/long-parameter-list.md) — flags lengthen signatures.
- [Switch Statements / Repeated Switches](../02-oo-abusers/switch-statements.md) — selector arguments usually come with `switch` statements.
- [Combinatorial Explosion](../03-change-preventers/combinatorial-explosion.md) — combinations of flags grow multiplicatively.
- [Boolean Props Explosion](../16-react-ts/boolean-prop-explosion.md) — React component variant.

## Automatic detection

| Language | Tools and rules |
|---|---|
| Python | Ruff `FBT001`, `FBT002`, `FBT003` (boolean trap). |
| C# | No standard Roslyn rule; review public methods with `bool` parameters as a hint. |
| React + TS | No core ESLint rule; review functions and components with boolean parameters or props that change behavior. |
| Go | revive `flag-parameter`. |

## Implementations

Each folder contains the `smelly` version, the `refactored` version and the tests showing that both have the same observable behavior.

| Language | Folder |
|---|---|
| Python | [`python/code_smells/functions/flag_arguments/`](../../../python/code_smells/functions/flag_arguments/) |
| C# | [`csharp/src/CodeSmells/Functions/FlagArguments/`](../../../csharp/src/CodeSmells/Functions/FlagArguments/) |
| React + TS | [`react-ts/src/smells/functions/flag-arguments/`](../../../react-ts/src/smells/functions/flag-arguments/) |
| Go | [`go/smells/functions/flag-arguments/`](../../../go/smells/functions/flag-arguments/) |
| Angular | [`angular/src/smells/functions/flag-arguments/`](../../../angular/src/smells/functions/flag-arguments/) |

## References

- Martin, R. C. (2008). *Clean Code: A Handbook of Agile Software Craftsmanship*. Prentice Hall (chapter 17, "Smells and Heuristics").
- Jerzyk, M. and Madeyski, L. (2023). *Code Smells: A Comprehensive Online Catalog and Taxonomy*. Online catalog: https://codesmells.org
- Fowler, M. — *FlagArgument* (bliki): https://martinfowler.com/bliki/FlagArgument.html
- Fowler, M. — *CodeSmell* (bliki): https://martinfowler.com/bliki/CodeSmell.html
