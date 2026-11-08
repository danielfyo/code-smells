# General

This category collects general design and readability heuristics that do not fit neatly into Fowler's
original families. Most come from the "General" section of *Clean Code* chapter 17, which lists thirty-six
heuristics, **G1 to G36**; the rest come from Kerievsky's *Refactoring to Patterns* (*Oddball Solution*) and
from Jerzyk and Madeyski's catalog (*Complicated Regex Expression*, *Callback Hell*). Many G heuristics are
covered by smells in other categories of this catalog; the table below shows where each one lives.

## Smells in this category

| ID | Smell | Sources | Summary |
|---|---|---|---|
| CS066 | [Multiple Languages in One Source File](multiple-languages-in-file.md) | Clean Code G1 | SQL, HTML, JS, XML... mixed into the same source file. |
| CS067 | [Obvious Behavior Is Unimplemented](obvious-behavior-unimplemented.md) | Clean Code G2 (principle of least surprise) | A function does not do what anyone would expect from its name or type. |
| CS068 | [Too Much Information / Indecent Exposure](too-much-information.md) | Clean Code G8; Kerievsky 2004 | Wide interfaces that expose internal details which should be private. |
| CS069 | [Vertical Separation](vertical-separation.md) | Clean Code G10 | Variables and functions defined far away from where they are used. |
| CS070 | [Obscured Intent / Clever Code](obscured-intent.md) | Clean Code G16; Jerzyk 2023 | Compact, cryptic code that shows off cleverness but hides what it does. |
| CS071 | [Misplaced Responsibility](misplaced-responsibility.md) | Clean Code G17 | Code placed where it was convenient for the author, not where a reader would look for it. |
| CS072 | [Missing Explanatory Variables](missing-explanatory-variables.md) | Clean Code G19 | Complex expressions not broken down into named intermediate variables. |
| CS073 | [Logical Dependency Not Made Physical](hidden-logical-dependency.md) | Clean Code G22 | A module assumes something about another (a size, an order) without explicitly asking for it. |
| CS074 | [Prefer Structure over Convention](convention-over-structure.md) | Clean Code G27 | Relying on conventions ("remember to add a case") instead of letting the structure enforce them. |
| CS075 | [Be Precise / Imprecision](imprecision.md) | Clean Code G26 | Using float for money, ignoring concurrency or assuming a query returns exactly one result. |
| CS076 | [Configurable Data at Low Levels](configurable-data-at-low-levels.md) | Clean Code G35 | Configuration constants buried deep inside the code. |
| CS077 | [Oddball Solution](oddball-solution.md) | Kerievsky 2004; Jerzyk 2023 | The same problem is solved in different ways in different parts of the system. |
| CS078 | [Complicated Regex Expression](complicated-regex.md) | Jerzyk 2023 | Long, cryptic regular expressions with no name, comments or decomposition. |
| CS079 | [Callback Hell / Pyramid of Doom](callback-hell.md) | Jerzyk 2023 | Callbacks nested inside one another that make asynchronous flow unreadable. |

## Mapping to Clean Code (chapter 17, G1-G36)

| Code | Heuristic | Smell in this catalog |
|---|---|---|
| G1 | Multiple Languages in One Source File | [Multiple Languages in One Source File](multiple-languages-in-file.md) |
| G2 | Obvious Behavior Is Unimplemented | [Obvious Behavior Is Unimplemented](obvious-behavior-unimplemented.md) |
| G3 | Incorrect Behavior at the Boundaries | [Incorrect Behavior at the Boundaries](../08-error-handling/incorrect-boundary-behavior.md) |
| G4 | Overridden Safeties | [Overridden Safeties](../08-error-handling/overridden-safeties.md) |
| G5 | Duplication | [Duplicate Code](../04-dispensables/duplicate-code.md) |
| G6 | Code at Wrong Level of Abstraction | [Mixed Levels of Abstraction](../07-functions/mixed-abstraction-levels.md) |
| G7 | Base Classes Depending on Their Derivatives | [Base Class Depending on Its Derivatives](../02-oo-abusers/base-class-depends-on-subclass.md) |
| G8 | Too Much Information | [Too Much Information / Indecent Exposure](too-much-information.md) |
| G9 | Dead Code | [Dead Code](../04-dispensables/dead-code.md) |
| G10 | Vertical Separation | [Vertical Separation](vertical-separation.md) |
| G11 | Inconsistency | [Inconsistent Names](../10-names/inconsistent-names.md) |
| G12 | Clutter | [Clutter](../04-dispensables/clutter.md) |
| G13 | Artificial Coupling | [Artificial Coupling](../05-couplers/artificial-coupling.md) |
| G14 | Feature Envy | [Feature Envy](../05-couplers/feature-envy.md) |
| G15 | Selector Arguments | [Flag / Selector Arguments](../07-functions/flag-arguments.md) |
| G16 | Obscured Intent | [Obscured Intent / Clever Code](obscured-intent.md) |
| G17 | Misplaced Responsibility | [Misplaced Responsibility](misplaced-responsibility.md) |
| G18 | Inappropriate Static | [Inappropriate Static](../02-oo-abusers/inappropriate-static.md) |
| G19 | Use Explanatory Variables | [Missing Explanatory Variables](missing-explanatory-variables.md) |
| G20 | Function Names Should Say What They Do | No dedicated entry |
| G21 | Understand the Algorithm | No dedicated entry |
| G22 | Make Logical Dependencies Physical | [Logical Dependency Not Made Physical](hidden-logical-dependency.md) |
| G23 | Prefer Polymorphism to If/Else or Switch/Case | [Switch Statements / Repeated Switches](../02-oo-abusers/switch-statements.md) |
| G24 | Follow Standard Conventions | No dedicated entry |
| G25 | Replace Magic Numbers with Named Constants | [Magic Numbers / Magic Strings](../06-data/magic-numbers.md) |
| G26 | Be Precise | [Be Precise / Imprecision](imprecision.md) |
| G27 | Structure over Convention | [Prefer Structure over Convention](convention-over-structure.md) |
| G28 | Encapsulate Conditionals | [Complicated Boolean Expression](../07-functions/complicated-boolean-expression.md) |
| G29 | Avoid Negative Conditionals | [Negative Conditionals](../07-functions/negative-conditionals.md) |
| G30 | Functions Should Do One Thing | [Long Method](../01-bloaters/long-method.md) |
| G31 | Hidden Temporal Couplings | [Hidden Temporal Coupling](../05-couplers/hidden-temporal-coupling.md) |
| G32 | Don't Be Arbitrary | No dedicated entry |
| G33 | Encapsulate Boundary Conditions | [Incorrect Behavior at the Boundaries](../08-error-handling/incorrect-boundary-behavior.md) |
| G34 | Functions Should Descend Only One Level of Abstraction | [Mixed Levels of Abstraction](../07-functions/mixed-abstraction-levels.md) |
| G35 | Keep Configurable Data at High Levels | [Configurable Data at Low Levels](configurable-data-at-low-levels.md) |
| G36 | Avoid Transitive Navigation | [Message Chains (Train Wreck)](../05-couplers/message-chains.md) |

G20 is closely related to [Fallacious Method Name](../10-names/fallacious-method-name.md) and [Ambiguous Name](../10-names/ambiguous-name.md); G24 to [Non-Standard Nomenclature](../10-names/non-standard-nomenclature.md) and [Oddball Solution](oddball-solution.md). G21 and G32 are process advice rather than detectable smells.

## How to read each entry

Every document follows the same structure: definition, symptoms, common causes, why it is a problem, a short
smelly example and its refactored solution, recommended refactorings, when it may be acceptable, related
smells, automatic detection and links to the implementations in Python, C#, React + TypeScript and Go. The
full catalog is in [`docs/CATALOG.md`](../../CATALOG.md) and the repository conventions in
[`docs/CONVENTIONS.md`](../../CONVENTIONS.md).

## References

- Martin, R. C. (2008). *Clean Code*, ch. 17 "Smells and Heuristics". Prentice Hall.
- Kerievsky, J. (2004). *Refactoring to Patterns*. Addison-Wesley.
- Jerzyk, M. and Madeyski, L. (2023). "Code Smells: A Comprehensive Online Catalog and Taxonomy". Online catalog: https://codesmells.org
- Fowler, M. (2018). *Refactoring: Improving the Design of Existing Code* (2nd ed.). Addison-Wesley. Refactoring catalog: https://refactoring.com/catalog/
- Refactoring.Guru, *Code Smells*: https://refactoring.guru/refactoring/smells
- Fowler, M. *CodeSmell* (bliki): https://martinfowler.com/bliki/CodeSmell.html
