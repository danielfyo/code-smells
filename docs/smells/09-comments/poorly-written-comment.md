# Poorly Written Comment

> **ID:** CS054 · **Category:** Comments · **Sources:** Clean Code C4

*Ambiguous, rambling or sloppy comments that confuse more than they help.*

## Definition

A comment that tries to convey useful information but is badly written: it is ambiguous, rambles, uses
private jargon, has typos or half sentences, or leaves the reader with more questions than before. *Clean
Code* (C4, *Poorly Written Comment*) says that if a comment is worth writing, it is worth writing well: brief,
precise, grammatical and without stating the obvious.

## Symptoms

- Incomplete or cryptic sentences (`// careful with this, don't touch the thing from before`).
- Long paragraphs mixing history, opinions and complaints before reaching the relevant point.
- Typos, internal abbreviations or languages mixed without criteria.
- Vague references: "fix for that thing the other day", "just in case".

## Common causes

- Comments written in a hurry at the end of a debugging session.
- No team convention about comment language and style.
- Writing for oneself rather than for the next reader.

## Why it is a problem

- **Misunderstandings**: every reader interprets the comment differently.
- **Wasted time** deciphering the text or tracking down its author.
- A sense of carelessness that lowers the standard of the surrounding code.

## Example (smelly)

```typescript
// here we do the discounts thing but CAREFUL if its an old
// customer (or was it new??) the other one doesnt apply, the black
// friday stuff isnt used anymore i think, ask someone... dont touch!!!
function applyDiscounts(order: Order): Order {
  // SMELL: the comment raises more questions than it answers
  // ...
}
```

## Solution (refactored)

```typescript
/**
 * Applies the order's discounts.
 * The loyalty discount and the promotional discount do not stack:
 * the larger of the two is applied (commercial policy, see ADR-007).
 */
function applyDiscounts(order: Order): Order {
  // REFACTOR: short, precise comment focused on the "why"
  // ...
}
```

## Recommended refactorings

- **Rewrite the comment** in complete, concrete sentences, in the language agreed by the team.
- **Extract Function** or **Extract Variable** so the code tells part of what the comment was trying to explain.
- Resolve the doubt instead of writing it down: if the comment says "I think this is no longer used", check and delete the dead code.
- Move discussions to the issue tracker and keep only the conclusion in the code.

## When it may be acceptable

- Temporary notes in a work branch, as long as they never reach the main branch.
- Comments in another natural language when the team has explicitly agreed on it.

## Related smells

- [Obsolete Comment](obsolete-comment.md): an ambiguous comment is hard to keep up to date.
- [Redundant Comment](redundant-comment.md): rambling often includes repeating the obvious.
- [Inappropriate Information](inappropriate-information.md): complaints and history do not belong in the code.
- [Ambiguous Name](../10-names/ambiguous-name.md): the same lack of precision applied to names.

## Automatic detection

- **Spelling**: `codespell` (Python and generic, also as a pre-commit hook), `cspell` (the *Code Spell Checker* extension and CLI, for TS/C#) and golangci-lint's `misspell` linter for Go.
- **Prose style**: tools such as Vale can be applied to comments and documentation.
- **Docstrings**: Ruff/pydocstyle (`D`) in Python, `eslint-plugin-jsdoc` in TypeScript and `revive` in Go check basic formatting, not clarity.

Only a person can judge whether a comment is clear: it is a natural point for code review.

## Implementations

- Python: [`python/code_smells/comments/poorly_written_comment/`](../../../python/code_smells/comments/poorly_written_comment/)
- C#: [`csharp/src/CodeSmells/Comments/PoorlyWrittenComment/`](../../../csharp/src/CodeSmells/Comments/PoorlyWrittenComment/)
- React + TS: [`react-ts/src/smells/comments/poorly-written-comment/`](../../../react-ts/src/smells/comments/poorly-written-comment/)
- Go: [`go/smells/comments/poorly-written-comment/`](../../../go/smells/comments/poorly-written-comment/)

Each folder contains a `smelly` version (the smell, marked with `SMELL:` comments) and a `refactored` version (marked with `REFACTOR:` comments), plus tests showing that both have the same observable behavior.

## References

- Martin, R. C. (2008). *Clean Code*, ch. 17 "Smells and Heuristics". Prentice Hall.
- Martin, R. C. (2008). *Clean Code*, ch. 4 "Comments". Prentice Hall.
- Jerzyk, M. and Madeyski, L. (2023). "Code Smells: A Comprehensive Online Catalog and Taxonomy". Online catalog: https://codesmells.org
