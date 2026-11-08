# Names

Names are everywhere in software: variables, functions, parameters, classes, packages and files. A good name
reveals intent, avoids disinformation and makes code searchable; a bad one forces every reader to reconstruct
the meaning from the implementation. Fowler opens the second edition of *Refactoring* with *Mysterious Name*,
and *Clean Code* devotes chapter 2 ("Meaningful Names") to the topic and lists seven naming heuristics in
chapter 17, **N1 to N7**, all implemented here. The category also includes naming smells from Jerzyk and
Madeyski's catalog and the naming side of G11 (*Inconsistency*).

## Smells in this category

| ID | Smell | Sources | Summary |
|---|---|---|---|
| CS056 | [Mysterious / Uncommunicative Name](uncommunicative-name.md) | Fowler 2018; Clean Code N1 | Names like d, tmp, data2 or proc that do not reveal intent. |
| CS057 | [Names at Wrong Abstraction Level](wrong-abstraction-level-name.md) | Clean Code N2 | Names that reveal the implementation (dialModem) rather than the concept (connect). |
| CS058 | [Non-Standard Nomenclature](non-standard-nomenclature.md) | Clean Code N3 | Ignoring well-known pattern names and the conventions of the language and domain. |
| CS059 | [Ambiguous Name](ambiguous-name.md) | Clean Code N4 | Names open to several interpretations, such as doRename or process. |
| CS060 | [Short Names for Long Scopes](short-names-long-scopes.md) | Clean Code N5 | Single-letter names used in wide scopes or with long lifetimes. |
| CS061 | [Encodings in Names / Type Embedded in Name](encodings-in-names.md) | Clean Code N6; Jerzyk 2023 | Hungarian notation, m_ prefixes or embedded types (strName, unnecessary IUserInterface). |
| CS062 | [Names Should Describe Side-Effects](names-hiding-side-effects.md) | Clean Code N7 | A getX() that also creates, saves or modifies things without its name saying so. |
| CS063 | [Inconsistent Names](inconsistent-names.md) | Clean Code G11; Jerzyk 2023 | The same concept goes by several names (fetch/get/retrieve, user/client/customer). |
| CS064 | [Binary Operator in Name](binary-operator-in-name.md) | Jerzyk 2023 | Names with And/Or (validateAndSave) that reveal the function does more than one thing. |
| CS065 | [Fallacious Method Name](fallacious-method-name.md) | Jerzyk 2023 | The name promises something different from what the method does (an isValid that modifies, a getX that returns something else). |

## Mapping to Clean Code (chapter 17, N1-N7)

| Code | Heuristic | Smell in this catalog |
|---|---|---|
| N1 | Choose Descriptive Names | [Mysterious / Uncommunicative Name](uncommunicative-name.md) |
| N2 | Choose Names at the Appropriate Level of Abstraction | [Names at Wrong Abstraction Level](wrong-abstraction-level-name.md) |
| N3 | Use Standard Nomenclature Where Possible | [Non-Standard Nomenclature](non-standard-nomenclature.md) |
| N4 | Unambiguous Names | [Ambiguous Name](ambiguous-name.md) |
| N5 | Use Long Names for Long Scopes | [Short Names for Long Scopes](short-names-long-scopes.md) |
| N6 | Avoid Encodings | [Encodings in Names / Type Embedded in Name](encodings-in-names.md) |
| N7 | Names Should Describe Side-Effects | [Names Should Describe Side-Effects](names-hiding-side-effects.md) |

Other entries in this category: [Inconsistent Names](inconsistent-names.md) (Clean Code G11; Jerzyk 2023), [Binary Operator in Name](binary-operator-in-name.md) and [Fallacious Method Name](fallacious-method-name.md) (Jerzyk 2023).

## Language-specific naming smells

Some naming problems only make sense in a given ecosystem: [Java-style Getters and Setters](../14-python/java-style-getters-setters.md), [Shadowing Built-ins](../14-python/shadowing-builtins.md), [Stuttering Names](../17-go/stuttering-names.md), [Getters with Get Prefix](../17-go/get-prefix-getters.md), [Error Strings Style](../17-go/error-string-style.md).

## How to read each entry

Every document follows the same structure: definition, symptoms, common causes, why it is a problem, a short
smelly example and its refactored solution, recommended refactorings, when it may be acceptable, related
smells, automatic detection and links to the implementations in Python, C#, React + TypeScript and Go. The
full catalog is in [`docs/CATALOG.md`](../../CATALOG.md) and the repository conventions in
[`docs/CONVENTIONS.md`](../../CONVENTIONS.md).

## References

- Martin, R. C. (2008). *Clean Code*, ch. 2 "Meaningful Names". Prentice Hall.
- Martin, R. C. (2008). *Clean Code*, ch. 17 "Smells and Heuristics". Prentice Hall.
- Fowler, M. (2018). *Refactoring: Improving the Design of Existing Code* (2nd ed.). Addison-Wesley. Refactoring catalog: https://refactoring.com/catalog/
- Jerzyk, M. and Madeyski, L. (2023). "Code Smells: A Comprehensive Online Catalog and Taxonomy". Online catalog: https://codesmells.org
- Refactoring.Guru, *Code Smells*: https://refactoring.guru/refactoring/smells
