# Data Dealers

> Problems in how data is represented, mutated and shared.

The **Data Dealers** category groups smells about how data is **represented, mutated and shared**:
structures that change in unexpected places, unnamed literals, booleans that lose their meaning, `null`
as the answer to everything, status flags that drive loops, and hand-written loops where a declarative
transformation would be clearer.

These smells come from various sources: *Mutable Data* and *Loops* from the second edition of
*Refactoring* (Fowler, 2018), *Magic Numbers* from *Clean Code* (G25), and *Boolean Blindness*, *Null
Check* and *Status Variable* from Jerzyk and Madeyski's catalog (2023), which in turn draws on ideas by
Robert Harper and Tony Hoare.

The common thread is that the code **hides information**: what a value means, who can change it, when it
may be missing. The solutions involve giving data names and types (constants, enumerations, optional
types, value objects) and preferring immutable transformations.

## Smells in this category

| ID | Smell | Sources | Summary |
|---|---|---|---|
| CS032 | [**Mutable Data**](mutable-data.md) | Fowler 2018 | Data that changes in unexpected places, causing bugs that are hard to trace. |
| CS033 | [**Magic Numbers / Magic Strings**](magic-numbers.md) | Clean Code G25 | Unnamed literals whose meaning has to be guessed. |
| CS034 | [**Boolean Blindness**](boolean-blindness.md) | Jerzyk 2023; Harper | Booleans that lose the meaning of what they represent, making calls like f(true, false) unreadable. |
| CS035 | [**Null Check / Null Abuse**](null-abuse.md) | Jerzyk 2023; Hoare | Returning and checking for null everywhere instead of using null objects, optionals or explicit errors. |
| CS036 | [**Status Variable**](status-variable.md) | Jerzyk 2023 | Mutable flag variables used to control the flow of loops or functions. |
| CS037 | [**Loops / Imperative Loops**](loops.md) | Fowler 2018 | Hand-written loops where a collection pipeline (map/filter/reduce) would express the intent better. |

## How to use this folder

Every document follows the template in [`docs/CONVENTIONS.md`](../../CONVENTIONS.md): definition, symptoms, causes, consequences, a smelly snippet and its solution, recommended refactorings, exceptions, related smells, automatic detection and links to the implementations in Python, C#, React + TypeScript and Go. The full index is in [`docs/CATALOG.md`](../../CATALOG.md).
