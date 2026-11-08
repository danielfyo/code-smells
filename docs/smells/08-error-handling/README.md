# Error Handling

Error handling smells appear when failures are ignored, hidden, encoded as ordinary values or used as a
control-flow mechanism. *Clean Code* devotes chapter 7 ("Error Handling", by Michael Feathers) to the topic:
error handling is important, but if it obscures logic it is wrong. The smells below cover both extremes:
errors that disappear silently (swallowed exceptions, error codes nobody checks, silenced warnings) and
exceptions abused for situations that are not exceptional, plus the classic source of defects at the edges of
the input domain.

## Smells in this category

| ID | Smell | Sources | Summary |
|---|---|---|---|
| CS046 | [Swallowed Exceptions / Afraid to Fail](swallowed-exceptions.md) | Jerzyk 2023; Clean Code | Catching errors and doing nothing (or only logging them), leaving the system in an inconsistent state. |
| CS047 | [Returning Error Codes](error-codes.md) | Clean Code ch. 7 | Returning -1, null or magic codes instead of explicit errors that cannot be ignored. |
| CS048 | [Exceptions for Control Flow](exceptions-for-control-flow.md) | Bloch; Microsoft Guidelines | Using exceptions for expected cases of the normal flow instead of conditions. |
| CS049 | [Overridden Safeties](overridden-safeties.md) | Clean Code G4 | Turning off compiler warnings, linters or failing tests just to "keep going". |
| CS050 | [Incorrect Behavior at the Boundaries](incorrect-boundary-behavior.md) | Clean Code G3/G33 | Boundary conditions (empty, zero, last element, off-by-one) that are scattered or not handled. |

## Relationship with other sources

- **Clean Code**: ch. 7 (prefer exceptions to return codes, do not return or pass `null`), and the chapter
  17 heuristics G3 (*Incorrect Behavior at the Boundaries*), G4 (*Overridden Safeties*) and G33
  (*Encapsulate Boundary Conditions*).
- **Jerzyk & Madeyski (2023)** catalog *Afraid to Fail* and related error handling smells.
- **Language-specific variants** live in their own categories: [Bare except](../14-python/bare-except.md), [Catching General Exception](../15-csharp/catch-general-exception.md), [Rethrowing with `throw ex`](../15-csharp/throw-ex.md), [Ignored Errors](../17-go/ignored-errors.md), [panic for Control Flow](../17-go/panic-for-control-flow.md).

## How to read each entry

Every document follows the same structure: definition, symptoms, common causes, why it is a problem, a short
smelly example and its refactored solution, recommended refactorings, when it may be acceptable, related
smells, automatic detection and links to the implementations in Python, C#, React + TypeScript and Go. The
full catalog is in [`docs/CATALOG.md`](../../CATALOG.md) and the repository conventions in
[`docs/CONVENTIONS.md`](../../CONVENTIONS.md).

## References

- Martin, R. C. (2008). *Clean Code*, ch. 7 "Error Handling" (by Michael Feathers). Prentice Hall.
- Martin, R. C. (2008). *Clean Code*, ch. 17 "Smells and Heuristics". Prentice Hall.
- Jerzyk, M. and Madeyski, L. (2023). "Code Smells: A Comprehensive Online Catalog and Taxonomy". Online catalog: https://codesmells.org
- Bloch, J. (2018). *Effective Java* (3rd ed.), Item 69 "Use exceptions only for exceptional conditions". Addison-Wesley.
- Cwalina, K. and Abrams, B. *Framework Design Guidelines* (Addison-Wesley), exception design chapter; also summarized in the .NET documentation ("Best practices for exceptions") on Microsoft Learn.
- Refactoring.Guru, *Code Smells*: https://refactoring.guru/refactoring/smells
