# Long Parameter List

> **ID:** CS003 · **Category:** Bloaters · **Sources:** Fowler 1999; Clean Code F1
>
> Functions with more than three or four parameters, hard to call correctly and hard to read.

## Definition

A **long parameter list** appears when a function takes more than three or four arguments. *Clean Code*
(F1) argues that zero, one or two is ideal and three already needs justification. The more parameters,
the harder it is to remember their order, the easier it is to swap two of the same type, and the more
combinations need testing.

Often the long list reveals that several parameters form a concept (a range, an address, a set of
options) that does not yet have a name in the code.

## Symptoms

- Signatures with five, six or more parameters.
- Calls such as `create(u, 3, true, null, "EUR", false)` that cannot be read without opening the definition.
- Several consecutive parameters of the same primitive type.
- Groups of parameters that repeat together across several functions.
- Parameters that are only passed in to be forwarded to another function.

## Common causes

- Avoiding dependencies between classes by passing everything explicitly.
- Adding "one more parameter" for each new need.
- Merging several algorithms into one function with control arguments.

## Why it is a problem

- Silent errors when arguments of the same type are swapped.
- Unstable signatures: every change breaks all callers.
- Functions that are hard to test because of the explosion of combinations.
- It hides domain abstractions that should exist.

## Example (smelly)

```ts
function createBooking(
  guestName: string,
  guestEmail: string,
  checkIn: Date,
  checkOut: Date,
  roomType: string,
  breakfast: boolean,
  currency: string,
) {
  // ...
}

createBooking("Ana", "ana@mail.test", d1, d2, "double", true, "EUR");
```

## Solution (refactored)

```ts
interface Guest { name: string; email: string }
interface Stay { checkIn: Date; checkOut: Date }
interface BookingOptions { roomType: RoomType; breakfast: boolean; currency: Currency }

function createBooking(guest: Guest, stay: Stay, options: BookingOptions) {
  // ...
}

createBooking(
  { name: "Ana", email: "ana@mail.test" },
  { checkIn: d1, checkOut: d2 },
  { roomType: "double", breakfast: true, currency: "EUR" },
);
```

## Recommended refactorings

- **Introduce Parameter Object**: groups parameters that travel together into a named type.
- **Preserve Whole Object**: passes the source object instead of several of its fields.
- **Replace Parameter with Query**: if the function can obtain the value by itself.
- **Remove Flag Argument**: when some parameters are control booleans.
- **Combine Functions into Class**: if several functions share the same parameters.

## When it may be acceptable

- Constructors of immutable value objects or DTOs, especially with named arguments (Python, C#) or builders.
- Mathematical functions whose signature is the domain's (e.g. `lerp(a, b, t)`).
- When grouping the parameters would create an unwanted dependency between independent modules.

## Related smells

- [Data Clumps](data-clumps.md) — repeated groups of parameters are data clumps.
- [Primitive Obsession](primitive-obsession.md) — long lists of primitives representing domain concepts.
- [Flag / Selector Arguments](../07-functions/flag-arguments.md) — control booleans lengthen the list and hide several functions.
- [Boolean Blindness](../06-data/boolean-blindness.md) — `f(true, false)` is unreadable at the call site.
- [Long Method](long-method.md) — functions with many parameters usually do too much.

## Automatic detection

| Language | Tools and rules |
|---|---|
| Python | Pylint `R0913 too-many-arguments` and `R0917 too-many-positional-arguments`; Ruff `PLR0913` and `PLR0917`. |
| C# | SonarQube `S107` (too many parameters); Visual Studio maintainability metrics. |
| React + TS | ESLint `max-params`; for components, review the number of props. |
| Go | revive `argument-limit` (and `function-result-limit` for results); gocritic `paramTypeCombine` flags consecutive parameters of the same type. |

## Implementations

Each folder contains the `smelly` version, the `refactored` version and the tests showing that both have the same observable behavior.

| Language | Folder |
|---|---|
| Python | [`python/code_smells/bloaters/long_parameter_list/`](../../../python/code_smells/bloaters/long_parameter_list/) |
| C# | [`csharp/src/CodeSmells/Bloaters/LongParameterList/`](../../../csharp/src/CodeSmells/Bloaters/LongParameterList/) |
| React + TS | [`react-ts/src/smells/bloaters/long-parameter-list/`](../../../react-ts/src/smells/bloaters/long-parameter-list/) |
| Go | [`go/smells/bloaters/long-parameter-list/`](../../../go/smells/bloaters/long-parameter-list/) |
| Angular | [`angular/src/smells/bloaters/long-parameter-list/`](../../../angular/src/smells/bloaters/long-parameter-list/) |

## References

- Fowler, M. (1999). *Refactoring: Improving the Design of Existing Code*. Addison-Wesley (chapter 3, "Bad Smells in Code", written with Kent Beck).
- Fowler, M. (2018). *Refactoring: Improving the Design of Existing Code* (2nd ed.). Addison-Wesley. Refactoring catalog: https://refactoring.com/catalog/
- Martin, R. C. (2008). *Clean Code: A Handbook of Agile Software Craftsmanship*. Prentice Hall (chapter 17, "Smells and Heuristics").
- Mäntylä, M. V. and Lassenius, C. (2006). "Subjective evaluation of software evolvability using code smells: An empirical study". *Empirical Software Engineering*, 11(3), 395-431.
- Jerzyk, M. and Madeyski, L. (2023). *Code Smells: A Comprehensive Online Catalog and Taxonomy*. Online catalog: https://codesmells.org
- Refactoring.Guru — Long Parameter List: https://refactoring.guru/smells/long-parameter-list
- Refactoring.Guru — Code Smells: https://refactoring.guru/refactoring/smells
- Fowler, M. — *CodeSmell* (bliki): https://martinfowler.com/bliki/CodeSmell.html
