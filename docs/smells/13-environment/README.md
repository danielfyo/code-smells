# Environment

Environment smells are not in the code but around it: in how the project is built and how its tests are run.
*Clean Code* chapter 17 lists two environment heuristics, **E1** and **E2**: building a project and running
its tests should each be a single trivial operation. When they are not, onboarding slows down, builds become
non-reproducible and tests are run less often, which undermines every other practice in this catalog.

## Smells in this category

| ID | Smell | Sources | Summary |
|---|---|---|---|
| CS091 | [Build Requires More Than One Step](multi-step-build.md) | Clean Code E1 | Building the project requires a manual sequence of commands, files and tribal knowledge. |
| CS092 | [Tests Require More Than One Step](multi-step-tests.md) | Clean Code E2 | Running all the tests cannot be done with a single command. |

## Mapping to Clean Code (chapter 17, E1-E2)

| Code | Heuristic | Smell in this catalog |
|---|---|---|
| E1 | Build Requires More Than One Step | [Build Requires More Than One Step](multi-step-build.md) |
| E2 | Tests Require More Than One Step | [Tests Require More Than One Step](multi-step-tests.md) |

## Implementation notes

These smells are illustrated with scripts and READMEs rather than application code: each `smelly/` folder
contains manual instructions (such as a `BUILD.md` with several steps) and each `refactored/` folder a
`Makefile` or script that does the same with one command, plus a minimal test where it makes sense. The
repository itself applies the refactored version: see the root `Makefile` and the one-command-per-language
table in [`docs/CONVENTIONS.md`](../../CONVENTIONS.md).

## How to read each entry

Every document follows the same structure: definition, symptoms, common causes, why it is a problem, a short
smelly example and its refactored solution, recommended refactorings, when it may be acceptable, related
smells, automatic detection and links to the implementations in Python, C#, React + TypeScript and Go. The
full catalog is in [`docs/CATALOG.md`](../../CATALOG.md) and the repository conventions in
[`docs/CONVENTIONS.md`](../../CONVENTIONS.md).

## References

- Martin, R. C. (2008). *Clean Code*, ch. 17 "Smells and Heuristics". Prentice Hall.
- Humble, J. and Farley, D. (2010). *Continuous Delivery*. Addison-Wesley.
- Hunt, A. and Thomas, D. (2019). *The Pragmatic Programmer* (20th anniversary ed.). Addison-Wesley.
- The Twelve-Factor App, "III. Config": https://12factor.net/config
