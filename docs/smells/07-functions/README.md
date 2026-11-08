# Functions & Conditional Logic

> Signatures, side effects and conditional logic that are hard to understand or use.

The **Functions & Conditional Logic** category brings together smells about the **signature** and the
**body** of functions: arguments used as outputs or as switches, side effects the signature does not
announce, functions that both query and modify, arrow-shaped nested conditionals, opaque or negative
boolean expressions, and mixed levels of abstraction.

Most of them come from *Clean Code* (chapter 3, "Functions", and the F and G heuristics in chapter 17),
from McConnell's *Code Complete*, from Bertrand Meyer's command-query separation principle and from
Jerzyk and Madeyski's catalog (2023).

The guiding idea is that **a function should do one thing, at one level of abstraction, and its name and
signature should tell the truth** about what it does. The typical refactorings are small and local:
extracting named functions and variables, introducing guard clauses, inverting conditions and separating
queries from modifiers.

## Smells in this category

| ID | Smell | Sources | Summary |
|---|---|---|---|
| CS038 | [**Output Arguments**](output-arguments.md) | Clean Code F2 | Parameters that the function modifies to return results, instead of using the return value. |
| CS039 | [**Flag / Selector Arguments**](flag-arguments.md) | Clean Code F3/G15 | A boolean or enum that makes the function do different things: it is really several functions. |
| CS040 | [**Side Effects**](side-effects.md) | Clean Code; Jerzyk 2023 | A function promises one thing but also changes global state, its arguments or the system without warning. |
| CS041 | [**Deep Nesting / Arrow Code**](deep-nesting.md) | McConnell; Jerzyk 2023 | Many nested levels of if/for that form an arrow and hide the main path. |
| CS042 | [**Complicated Boolean Expression**](complicated-boolean-expression.md) | Clean Code G28; Jerzyk 2023 | Long, opaque conditions that should be encapsulated in named functions or variables. |
| CS043 | [**Negative Conditionals**](negative-conditionals.md) | Clean Code G29 | Conditions expressed negatively (or as double negatives) that are harder to read than their positive form. |
| CS044 | [**Mixed Levels of Abstraction**](mixed-abstraction-levels.md) | Clean Code G6/G34 | A function mixes low-level details with high-level operations. |
| CS045 | [**Command-Query Separation Violation**](command-query-violation.md) | Meyer; Clean Code | Functions that both change state and return information, creating ambiguity. |

## How to use this folder

Every document follows the template in [`docs/CONVENTIONS.md`](../../CONVENTIONS.md): definition, symptoms, causes, consequences, a smelly snippet and its solution, recommended refactorings, exceptions, related smells, automatic detection and links to the implementations in Python, C#, React + TypeScript and Go. The full index is in [`docs/CATALOG.md`](../../CATALOG.md).
