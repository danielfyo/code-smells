# Obsolete Comment

> **ID:** CS052 · **Category:** Comments · **Sources:** Clean Code C2; Jerzyk 2023 (Fallacious Comment)

*Comments that fell out of date with the code and now lie.*

## Definition

A comment that described the code correctly at some point but has fallen behind subsequent changes. It now
states something false: a parameter that no longer exists, a different threshold, behavior that changed.
*Clean Code* (C2, *Obsolete Comment*) recommends updating or deleting it as soon as possible; Jerzyk and
Madeyski include it under *Fallacious Comment*, because a comment that lies is worse than no comment at all.

## Symptoms

- The comment mentions values, names or parameters that do not match the adjacent code.
- Docstrings or XML docs describing nonexistent arguments or exceptions.
- Comments in the past tense or about an old version ("we now use API v1").
- Discrepancies found while debugging: "the comment says 10%, but the code applies 15%".

## Common causes

- Code is modified without rereading nearby comments.
- Overly detailed comments that restate (and thus duplicate) the implementation.
- Code reviews that ignore comments.

## Why it is a problem

- **Active misinformation**: readers trust the comment and make wrong decisions.
- **Loss of trust** in every comment in the project, even the correct ones.
- Bugs introduced by someone who "fixes" the code to match the wrong comment.

## Example (smelly)

```python
def shipping_cost(order: Order) -> Decimal:
    # Free shipping for orders over 50 euros.
    # SMELL: the threshold changed to 60 and the comment still says 50
    if order.total >= Decimal("60"):
        return Decimal("0")
    # Flat rate of 4.95 (also stale: it now depends on weight)
    return rate_for_weight(order.weight)
```

## Solution (refactored)

```python
FREE_SHIPPING_THRESHOLD = Decimal("60")


def shipping_cost(order: Order) -> Decimal:
    # REFACTOR: the named constant replaces the comment and cannot go stale
    if order.total >= FREE_SHIPPING_THRESHOLD:
        return Decimal("0")
    return rate_for_weight(order.weight)
```

## Recommended refactorings

- **Delete or update** the comment as soon as it is spotted.
- **Extract Variable** (or a named constant) so the code says what the comment used to say.
- **Extract Function** with a name that captures the intent instead of describing it in a comment.
- **Introduce Assertion** or a test that turns the comment's claim into something verifiable.

## When it may be acceptable

- A lying comment is never desirable; what is acceptable is "why" comments, which by nature change rarely.
- Historical notes explicitly marked as such in design documentation (ADRs), not in the code.

## Related smells

- [Redundant Comment](redundant-comment.md): comments that repeat the code are the ones that go stale most easily.
- [Poorly Written Comment](poorly-written-comment.md): ambiguity makes it hard to tell whether a comment is still true.
- [Inappropriate Information](inappropriate-information.md): metadata that expires quickly.
- [Fallacious Method Name](../10-names/fallacious-method-name.md): the same problem moved into a name.
- [Comments (as deodorant)](../04-dispensables/excessive-comments.md): more comments, more surface area to go stale.

## Automatic detection

- **Python**: Pylint (with the `pylint.extensions.docparams` extension) and pydocstyle/Ruff `D` flag docstrings whose parameters do not match the signature.
- **C#**: the compiler warns with `CS1572`/`CS1573` when XML documentation mentions nonexistent parameters or misses one (with `GenerateDocumentationFile` enabled).
- **TypeScript**: `eslint-plugin-jsdoc` (`jsdoc/check-param-names`, `jsdoc/require-param`) validates JSDoc against the signature.
- **Go**: no semantic check; `revive` (`exported` rule) only requires the comment to start with the identifier name.

Semantic staleness (a different number or behavior) can only be caught in code review.

## Implementations

- Python: [`python/code_smells/comments/obsolete_comment/`](../../../python/code_smells/comments/obsolete_comment/)
- C#: [`csharp/src/CodeSmells/Comments/ObsoleteComment/`](../../../csharp/src/CodeSmells/Comments/ObsoleteComment/)
- React + TS: [`react-ts/src/smells/comments/obsolete-comment/`](../../../react-ts/src/smells/comments/obsolete-comment/)
- Go: [`go/smells/comments/obsolete-comment/`](../../../go/smells/comments/obsolete-comment/)

Each folder contains a `smelly` version (the smell, marked with `SMELL:` comments) and a `refactored` version (marked with `REFACTOR:` comments), plus tests showing that both have the same observable behavior.

## References

- Martin, R. C. (2008). *Clean Code*, ch. 17 "Smells and Heuristics". Prentice Hall.
- Martin, R. C. (2008). *Clean Code*, ch. 4 "Comments". Prentice Hall.
- Jerzyk, M. and Madeyski, L. (2023). "Code Smells: A Comprehensive Online Catalog and Taxonomy". Online catalog: https://codesmells.org
- Fowler, M. (2018). *Refactoring: Improving the Design of Existing Code* (2nd ed.). Addison-Wesley. Refactoring catalog: https://refactoring.com/catalog/
- Refactoring.Guru, *Code Smells*: https://refactoring.guru/refactoring/smells
