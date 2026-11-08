# Inappropriate Information

> **ID:** CS051 · **Category:** Comments · **Sources:** Clean Code C1

*Comments holding information that belongs in another system: authors, dates, change history, tickets.*

## Definition

A comment contains information that should live elsewhere: the author, modification dates, change history,
ticket numbers, meeting notes or deployment details. *Clean Code* (C1, *Inappropriate Information*) states
that comments should be reserved for technical notes about the code and design; metadata belongs in version
control, the issue tracker or the documentation.

## Symptoms

- Headers with `Author:`, `Created on:`, `Modified by:` or changelog blocks at the top of the file.
- Comments like `// JIRA-1234: changed at Marketing's request (Tuesday meeting)`.
- People's names, emails or dates next to code fragments.
- Deployment or environment setup instructions inside source code.

## Common causes

- Habits from before modern version control systems.
- IDE templates that generate headers automatically.
- Wanting to record "who is to blame" or a decision, in the wrong place.

## Why it is a problem

- **Information that goes stale** as soon as someone changes the code without touching the header.
- **Noise**: readers have to skip irrelevant lines to reach the code.
- **Duplication** of `git log`/`git blame`, which are always more accurate.
- Possible exposure of internal data (names, customers, incidents) in code that gets published.

## Example (smelly)

```go
// ============================================================
// Author: J. Smith  -  Created: 2019-02-03
// Modified: M. Jones 2021-07-12 (ticket INV-881, meeting with Finance)
// Modified: J. Smith 2023-03-01 changed the rounding
// ============================================================

// SMELL: metadata that belongs in git and in the issue tracker
func InvoiceTotal(lines []Line) Money {
    // ...
}
```

## Solution (refactored)

```go
// InvoiceTotal adds up the lines and rounds to the cent using banker's
// rounding, as required by invoicing regulations.
//
// REFACTOR: only technical information remains; the history lives in git
// and the business context in the ticket linked from the commit.
func InvoiceTotal(lines []Line) Money {
    // ...
}
```

## Recommended refactorings

- **Delete the comment** and rely on `git log`, `git blame` and descriptive commit messages.
- **Move the information** to the right place: the ticket, an ADR (Architecture Decision Record), `CHANGELOG.md` or the README.
- Keep only the technical part that explains *why* the code is the way it is, if any.

## When it may be acceptable

- License or copyright headers required by law (SPDX, Apache, MIT).
- References to a standard, RFC or regulation that justify a technical decision.
- A short link to an external issue explaining a temporary workaround (e.g. a library bug), as long as it is removed when resolved.

## Related smells

- [Obsolete Comment](obsolete-comment.md): metadata is the first thing to go stale.
- [Redundant Comment](redundant-comment.md): it repeats what version control already knows.
- [Comments (as deodorant)](../04-dispensables/excessive-comments.md): it contributes to excessive commenting.
- [Commented-Out Code](commented-out-code.md): another use of comments as a substitute for version control.

## Automatic detection

- **Python**: Ruff's `TD` (flake8-todos) and `FIX` (flake8-fixme) rules for badly formatted `TODO`/`FIXME` notes or notes carrying an author.
- **C#**: SonarQube `S1135` (`TODO` tags) and `S1134` (`FIXME` tags).
- **TypeScript**: ESLint `no-warning-comments` for configurable terms (`TODO`, `FIXME`, `HACK`).
- **Go**: golangci-lint with `godox` (detects `TODO`, `FIXME`, `BUG`...).

There are no standard rules for author or history headers; a regular-expression search (`Author:`,
`Modified`, dates) during code review or in a pre-commit hook works well.

## Implementations

- Python: [`python/code_smells/comments/inappropriate_information/`](../../../python/code_smells/comments/inappropriate_information/)
- C#: [`csharp/src/CodeSmells/Comments/InappropriateInformation/`](../../../csharp/src/CodeSmells/Comments/InappropriateInformation/)
- React + TS: [`react-ts/src/smells/comments/inappropriate-information/`](../../../react-ts/src/smells/comments/inappropriate-information/)
- Go: [`go/smells/comments/inappropriate-information/`](../../../go/smells/comments/inappropriate-information/)

Each folder contains a `smelly` version (the smell, marked with `SMELL:` comments) and a `refactored` version (marked with `REFACTOR:` comments), plus tests showing that both have the same observable behavior.

## References

- Martin, R. C. (2008). *Clean Code*, ch. 17 "Smells and Heuristics". Prentice Hall.
- Martin, R. C. (2008). *Clean Code*, ch. 4 "Comments". Prentice Hall.
- Jerzyk, M. and Madeyski, L. (2023). "Code Smells: A Comprehensive Online Catalog and Taxonomy". Online catalog: https://codesmells.org
- Refactoring.Guru, *Code Smells*: https://refactoring.guru/refactoring/smells
