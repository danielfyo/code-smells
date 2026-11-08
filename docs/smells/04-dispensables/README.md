# Dispensables

> Something pointless or unnecessary whose absence would make the code cleaner and easier to understand.

**Dispensables** are elements whose absence would make the code cleaner, smaller and easier to
understand: duplication, classes that do almost nothing, code that never runs, abstractions created
"just in case", comments that cover up confusing code, and assorted noise.

What they have in common is that they **add cognitive load without adding value**. Every line of code is
a liability that must be read, maintained, compiled and tested; lines that contribute neither to behavior
nor to clarity should go. Most of them are fixed by **removing** (*Remove Dead Code*, *Inline Class*,
*Collapse Hierarchy*) or **unifying** (*Extract Function*, *Pull Up Method*).

The category comes from Mäntylä and Lassenius's (2006) taxonomy; *Clean Code* adds clutter (G12) and
reinforces the DRY principle (G5).

## Smells in this category

| ID | Smell | Sources | Summary |
|---|---|---|---|
| CS016 | [**Duplicate Code**](duplicate-code.md) | Fowler 1999; Clean Code G5 (DRY) | The same piece of logic appears in several places; every change has to be replicated and it is easy to forget one. |
| CS017 | [**Lazy Class / Lazy Element**](lazy-class.md) | Fowler 1999/2018 | A class or function that does so little that it does not justify its existence. |
| CS018 | [**Data Class**](data-class.md) | Fowler 1999 | Classes with only fields and getters/setters, while the logic that manipulates them lives in other classes. |
| CS019 | [**Dead Code**](dead-code.md) | Fowler 1999; Clean Code G9/F4 | Variables, parameters, functions or branches that are never used or executed. |
| CS020 | [**Speculative Generality**](speculative-generality.md) | Fowler 1999 | Abstractions, hooks and parameters created "just in case" that nobody needs (YAGNI). |
| CS021 | [**Comments (as deodorant)**](excessive-comments.md) | Fowler 1999 | Comments used to explain confusing code instead of rewriting it so it explains itself. |
| CS022 | [**Clutter**](clutter.md) | Clean Code G12 | Empty constructors, unused variables, unnecessary imports and noise that adds nothing. |

## How to use this folder

Every document follows the template in [`docs/CONVENTIONS.md`](../../CONVENTIONS.md): definition, symptoms, causes, consequences, a smelly snippet and its solution, recommended refactorings, exceptions, related smells, automatic detection and links to the implementations in Python, C#, React + TypeScript and Go. The full index is in [`docs/CATALOG.md`](../../CATALOG.md).
