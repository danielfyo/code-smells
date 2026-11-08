# Comments

Comments are not inherently good or bad, but they are expensive: they are not compiled or tested, so they drift
away from the code they describe. *Clean Code* (ch. 4) argues that the proper use of comments is to compensate
for our failure to express ourselves in code, and chapter 17 lists five comment heuristics, **C1 to C5**. This
category implements all five. Comments that explain *why* (intent, trade-offs, legal requirements, warnings)
remain valuable; the smells below are about comments that add noise, lie or replace better code.

## Smells in this category

| ID | Smell | Sources | Summary |
|---|---|---|---|
| CS051 | [Inappropriate Information](inappropriate-information.md) | Clean Code C1 | Comments holding information that belongs in another system: authors, dates, change history, tickets. |
| CS052 | [Obsolete Comment](obsolete-comment.md) | Clean Code C2; Jerzyk 2023 (Fallacious Comment) | Comments that fell out of date with the code and now lie. |
| CS053 | [Redundant Comment](redundant-comment.md) | Clean Code C3 | Comments that repeat what the code already says clearly. |
| CS054 | [Poorly Written Comment](poorly-written-comment.md) | Clean Code C4 | Ambiguous, rambling or sloppy comments that confuse more than they help. |
| CS055 | [Commented-Out Code](commented-out-code.md) | Clean Code C5 | Blocks of commented-out code nobody dares to delete; that is what version control is for. |

## Mapping to Clean Code (chapter 17, C1-C5)

| Code | Heuristic | Smell in this catalog |
|---|---|---|
| C1 | Inappropriate Information | [Inappropriate Information](inappropriate-information.md) |
| C2 | Obsolete Comment | [Obsolete Comment](obsolete-comment.md) |
| C3 | Redundant Comment | [Redundant Comment](redundant-comment.md) |
| C4 | Poorly Written Comment | [Poorly Written Comment](poorly-written-comment.md) |
| C5 | Commented-Out Code | [Commented-Out Code](commented-out-code.md) |

See also [Comments (as deodorant)](../04-dispensables/excessive-comments.md) (Dispensables), which deals with comments used as deodorant for unclear code.

## How to read each entry

Every document follows the same structure: definition, symptoms, common causes, why it is a problem, a short
smelly example and its refactored solution, recommended refactorings, when it may be acceptable, related
smells, automatic detection and links to the implementations in Python, C#, React + TypeScript and Go. The
full catalog is in [`docs/CATALOG.md`](../../CATALOG.md) and the repository conventions in
[`docs/CONVENTIONS.md`](../../CONVENTIONS.md).

## References

- Martin, R. C. (2008). *Clean Code*, ch. 4 "Comments". Prentice Hall.
- Martin, R. C. (2008). *Clean Code*, ch. 17 "Smells and Heuristics". Prentice Hall.
- Jerzyk, M. and Madeyski, L. (2023). "Code Smells: A Comprehensive Online Catalog and Taxonomy". Online catalog: https://codesmells.org
- Fowler, M. (2018). *Refactoring: Improving the Design of Existing Code* (2nd ed.). Addison-Wesley. Refactoring catalog: https://refactoring.com/catalog/
- Refactoring.Guru, *Code Smells*: https://refactoring.guru/refactoring/smells
