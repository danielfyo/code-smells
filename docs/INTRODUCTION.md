# Introduction to code smells

## What is a code smell?

A **code smell** is a **surface symptom** in source code that usually points to a **deeper design
problem**. It is not a bug: the program works. But the smell warns that the code will be harder than
necessary to understand, change, test or extend.

> "A code smell is a surface indication that usually corresponds to a deeper problem in the system."
> — Martin Fowler, [CodeSmell](https://martinfowler.com/bliki/CodeSmell.html)

Three key ideas:

1. **It is a heuristic, not a rule.** A 40-line method can be perfectly fine. A smell is an invitation
   to look closer, not a verdict.
2. **It is quick to spot.** A good smell is recognizable at a glance ("this function takes 9
   parameters"), even if understanding the cause takes more analysis.
3. **It is cured by refactoring.** Every smell has one or more refactorings (behavior-preserving
   structural changes) that remove it.

## A short history

| Year | Milestone |
|---|---|
| 1999 | **Kent Beck and Martin Fowler** coin and popularize the term in chapter 3, *Bad Smells in Code*, of *Refactoring: Improving the Design of Existing Code*: 22 smells. |
| 2003-2006 | **Mika Mäntylä and Casper Lassenius** propose the most cited taxonomy: *Bloaters, Object-Orientation Abusers, Change Preventers, Dispensables and Couplers*. |
| 2004 | **Joshua Kerievsky**, *Refactoring to Patterns*, adds smells such as *Combinatorial Explosion*, *Oddball Solution* and *Indecent Exposure*. |
| 2001-2007 | **van Deursen et al.** (2001) and **Gerard Meszaros** (*xUnit Test Patterns*, 2007) catalog **test smells**: *Assertion Roulette, Mystery Guest, Eager Test, Fragile Test*... |
| 2008 | **Robert C. Martin**, *Clean Code*, chapter 17 *Smells and Heuristics*: codes C1-C5 (comments), E1-E2 (environment), F1-F4 (functions), G1-G36 (general), N1-N7 (names), T1-T9 (tests). |
| 2018 | **Fowler**, 2nd edition of *Refactoring*: adds *Mysterious Name, Global Data, Mutable Data, Loops, Insider Trading, Repeated Switches*. |
| 2023 | **Marcel Jerzyk and Lech Madeyski**, *Code Smells: A Comprehensive Online Catalog and Taxonomy*: 56 smells (15 new) at [codesmells.org](https://codesmells.org). |

## Taxonomy used in this repository

We start from Mäntylä's taxonomy (categories 01-05), extend it with categories from Fowler's second
edition, *Clean Code* and Jerzyk's catalog (06-13), and add idiomatic smells for each language (14-17):

| # | Category | Idea |
|---|---|---|
| 01 | Bloaters | Something has grown too large. |
| 02 | Object-Orientation Abusers | Object orientation is misused or half-applied. |
| 03 | Change Preventers | One change forces edits in many places. |
| 04 | Dispensables | Something is unnecessary: deleting it improves the code. |
| 05 | Couplers | Too much dependency between modules. |
| 06 | Data Dealers | Representation, mutation and sharing of data. |
| 07 | Functions & Conditional Logic | Signatures, side effects and conditionals. |
| 08 | Error Handling | Errors ignored, hidden or misused. |
| 09 | Comments | Clean Code C1-C5. |
| 10 | Names | Clean Code N1-N7 and Jerzyk. |
| 11 | General | Clean Code G1-G36, Kerievsky and Jerzyk. |
| 12 | Test Smells | Clean Code T1-T9 and *xUnit Test Patterns*. |
| 13 | Environment | Clean Code E1-E2. |
| 14-17 | Language-specific | Python, C#/.NET, React + TypeScript and Go. |

The full list is in [CATALOG.md](CATALOG.md).

## How to read each example

Every smell has, per language, a **`smelly`** version and a **`refactored`** version with the same
observable behavior, plus a test proving it. We recommend:

1. Read the smell's page in `docs/smells/...` (definition, symptoms, consequences, refactorings).
2. Open the `smelly` version and look for the `SMELL:` comments.
3. Try to refactor it yourself before looking at the solution.
4. Compare with the `refactored` version and its `REFACTOR:` comments.
5. Run the tests and check that behavior is preserved.

## Smells, anti-patterns and bugs

- **Code smell**: a local symptom that *suggests* a design problem (long method, cryptic names).
- **Anti-pattern**: a recurring solution that *looks* good but has proven negative consequences
  (Service Locator, Anemic Domain Model, God Class).
- **Latent bug**: some idiomatic smells (mutable default arguments in Python, `async void` in C#,
  goroutine leaks in Go, `key={index}` in React) **already are** defects waiting to happen. They are in
  the catalog because they are detected the same way as smells: by their shape.

## Main sources

- Fowler, M. (1999, 2018). *Refactoring: Improving the Design of Existing Code*. Addison-Wesley.
- Martin, R. C. (2008). *Clean Code: A Handbook of Agile Software Craftsmanship*. Prentice Hall. Ch. 17.
- Kerievsky, J. (2004). *Refactoring to Patterns*. Addison-Wesley.
- Mäntylä, M. V., Lassenius, C. (2006). *Subjective evaluation of software evolvability using code smells:
  An empirical study*. Empirical Software Engineering, 11(3).
- Meszaros, G. (2007). *xUnit Test Patterns: Refactoring Test Code*. Addison-Wesley.
- van Deursen, A., Moonen, L., van den Bergh, A., Kok, G. (2001). *Refactoring Test Code*. XP 2001.
- Jerzyk, M., Madeyski, L. (2023). *Code Smells: A Comprehensive Online Catalog and Taxonomy*.
  [codesmells.org](https://codesmells.org).
- [Refactoring.Guru — Code Smells](https://refactoring.guru/refactoring/smells).
- Language-specific: PEP 8, *The Little Book of Python Anti-Patterns*; Microsoft Learn and
  [David Fowler's AsyncGuidance](https://github.com/davidfowl/AspNetCoreDiagnosticScenarios/blob/master/AsyncGuidance.md);
  [react.dev](https://react.dev); [Effective Go](https://go.dev/doc/effective_go),
  [Go Code Review Comments](https://go.dev/wiki/CodeReviewComments) and *100 Go Mistakes* (T. Harsanyi).
