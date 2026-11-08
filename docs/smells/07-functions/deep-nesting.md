# Deep Nesting / Arrow Code

> **ID:** CS041 · **Category:** Functions & Conditional Logic · **Sources:** McConnell; Jerzyk 2023
>
> Many nested levels of if/for that form an arrow and hide the main path.

## Definition

**Deep nesting** (or "arrow code", after the shape the indentation draws) appears when a function piles
up many levels of nested `if`, `for`, `while` and `try`. McConnell (*Code Complete*) recommends not
exceeding three levels: beyond that, few people can follow the reasoning.

The main path (the normal case) is buried at the deepest level, while error cases and preconditions
surround it like layers of an onion.

## Symptoms

- More than three levels of indentation from control structures.
- `else` blocks far from their matching `if`.
- The "useful" code starts halfway across the screen because of indentation.
- Error checks wrapping the entire body of the function.

## Common causes

- The "single return point" rule applied strictly.
- Adding new conditions by wrapping existing code.
- Loops with complex logic inside that is not extracted.

## Why it is a problem

- High cognitive complexity: you have to remember every condition from the outer levels.
- Mistakes when matching `else` branches and modifying the logic.
- Long functions that are hard to test.

## Example (smelly)

```python
def ship(order):
    if order is not None:
        if order.is_paid:
            if order.items:
                if order.address.is_valid():
                    return carrier.create_label(order)
                else:
                    raise ValueError("invalid address")
            else:
                raise ValueError("empty order")
        else:
            raise ValueError("unpaid order")
    else:
        raise ValueError("no order")
```

## Solution (refactored)

```python
def ship(order):
    if order is None:
        raise ValueError("no order")
    if not order.is_paid:
        raise ValueError("unpaid order")
    if not order.items:
        raise ValueError("empty order")
    if not order.address.is_valid():
        raise ValueError("invalid address")
    return carrier.create_label(order)
```

Guard clauses dispatch the exceptional cases first; the main path stays at the end, with no indentation.

## Recommended refactorings

- **Replace Nested Conditional with Guard Clauses**: early exits for the special cases.
- **Extract Function**: turns the body of inner loops and blocks into named functions.
- **Decompose Conditional**: names conditions and branches.
- **Replace Loop with Pipeline**: removes levels caused by filters inside loops.
- **Replace Conditional with Polymorphism**: when the nesting comes from decisions by type.

## When it may be acceptable

- Inherently nested algorithms (matrix or graph traversals) with little logic at each level.
- Two or three short, clear levels that can be read at a glance.

## Related smells

- [Long Method](../01-bloaters/long-method.md) — nesting tends to grow in long methods.
- [Complicated Boolean Expression](complicated-boolean-expression.md) — nested conditions are sometimes merged into opaque expressions.
- [Status Variable](../06-data/status-variable.md) — status flags accompany nesting.
- [Callback Hell / Pyramid of Doom](../11-general/callback-hell.md) — nesting of callbacks in asynchronous code.
- [Nested Ternaries in JSX](../16-react-ts/nested-ternaries-jsx.md) — JSX variant.

## Automatic detection

| Language | Tools and rules |
|---|---|
| Python | Pylint `R1702 too-many-nested-blocks`; Ruff `PLR1702` (preview), `C901`, `SIM102` (collapsible nested `if`), `RET505` (`else` after `return`). |
| C# | SonarQube `S134` (control flow nested too deeply), `S1066` (collapsible `if`), `S3776` (cognitive complexity). |
| React + TS | ESLint `max-depth`, `no-else-return`, `no-lonely-if`, `max-nested-callbacks`; `sonarjs/cognitive-complexity`, `sonarjs/no-collapsible-if`. |
| Go | golangci-lint `nestif`, `gocognit`; revive `max-control-nesting`, `early-return`, `indent-error-flow`, `superfluous-else`. |

## Implementations

Each folder contains the `smelly` version, the `refactored` version and the tests showing that both have the same observable behavior.

| Language | Folder |
|---|---|
| Python | [`python/code_smells/functions/deep_nesting/`](../../../python/code_smells/functions/deep_nesting/) |
| C# | [`csharp/src/CodeSmells/Functions/DeepNesting/`](../../../csharp/src/CodeSmells/Functions/DeepNesting/) |
| React + TS | [`react-ts/src/smells/functions/deep-nesting/`](../../../react-ts/src/smells/functions/deep-nesting/) |
| Go | [`go/smells/functions/deep-nesting/`](../../../go/smells/functions/deep-nesting/) |
| Angular | [`angular/src/smells/functions/deep-nesting/`](../../../angular/src/smells/functions/deep-nesting/) |

## References

- Jerzyk, M. and Madeyski, L. (2023). *Code Smells: A Comprehensive Online Catalog and Taxonomy*. Online catalog: https://codesmells.org
- McConnell, S. (2004). *Code Complete* (2nd ed.). Microsoft Press.
- Fowler, M. — *CodeSmell* (bliki): https://martinfowler.com/bliki/CodeSmell.html
