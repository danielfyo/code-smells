# Shotgun Surgery

> **ID:** CS013 · **Category:** Change Preventers · **Sources:** Fowler 1999
>
> A single conceptual change forces small modifications in many different classes.

## Definition

**Shotgun surgery** is the opposite of divergent change: a single conceptual change (adding a field,
modifying a tax, changing a business rule) forces small modifications in many different classes or
files. Because the changes are scattered, it is easy to miss one.

It indicates that a responsibility is **fragmented**: knowledge about a design decision has been spread
across the code instead of being encapsulated in a single place.

## Symptoms

- A simple change produces a diff touching ten files with one line each.
- The same constant, rule or format is copied into several modules.
- Bugs after a change come from "the place someone forgot to update".
- Text searches are a routine step before any modification.

## Common causes

- Duplication of knowledge (not necessarily identical code).
- Over-splitting responsibilities into pieces that are too small.
- Missing type or module to encapsulate the concept.

## Why it is a problem

- High risk of inconsistencies and regressions.
- Every change is slow and requires knowing the whole system.
- Estimates are unreliable because the real impact is hard to foresee.

## Example (smelly)

```tsx
// cart.ts
export const cartTotal = (net: number) => net * 1.21;
// invoice.ts
export const invoiceTotal = (net: number) => Math.round(net * 1.21 * 100) / 100;
// receipt.tsx
export const Receipt = ({ net }: { net: number }) => <p>VAT (21%): {net * 0.21}</p>;
```

## Solution (refactored)

```tsx
// tax.ts — the tax rule lives in a single module
export const VAT_RATE = 0.21;
export const vatOf = (net: number) => net * VAT_RATE;
export const grossOf = (net: number) => Math.round((net + vatOf(net)) * 100) / 100;

// cart.ts
export const cartTotal = grossOf;
// receipt.tsx
export const Receipt = ({ net }: { net: number }) => (
  <p>VAT ({VAT_RATE * 100}%): {vatOf(net)}</p>
);
```

Changing the VAT rate is now a one-line change in `tax.ts`.

## Recommended refactorings

- **Move Function**: and **Move Field**: concentrate everything about the concept in one module.
- **Combine Functions into Class**: groups functions that operate on the same data.
- **Combine Functions into Transform**: when several functions derive values from the same input data.
- **Inline Function**: and **Inline Class**: undo excessive fragmentation before regrouping.

## When it may be acceptable

- Legitimate cross-cutting changes (renaming a domain concept throughout the system).
- Code generated from a common schema, where the change is made in the generator.

## Related smells

- [Divergent Change](divergent-change.md) — its complement: one class, many reasons.
- [Duplicate Code](../04-dispensables/duplicate-code.md) — duplicated knowledge is the main cause.
- [Magic Numbers / Magic Strings](../06-data/magic-numbers.md) — repeated literals that must be changed everywhere.
- [Data Clumps](../01-bloaters/data-clumps.md) — extending a data clump forces changes to many signatures.
- [Switch Statements / Repeated Switches](../02-oo-abusers/switch-statements.md) — adding a variant forces you to touch every `switch`.

## Automatic detection

| Language | Tools and rules |
|---|---|
| Python | Pylint `R0801 duplicate-code`; change coupling analysis of the history with `code-maat`. |
| C# | SonarQube duplication detection and `S1192` (duplicated literals); change coupling analysis (e.g. CodeScene). |
| React + TS | `jscpd`, `sonarjs/no-duplicate-string`; analysis of files that change together in the history. |
| Go | golangci-lint `dupl` and `goconst`; change coupling analysis of the history. |

The most reliable signal is temporal: files that always appear together in the same commits without explicitly depending on each other.

## Implementations

Each folder contains the `smelly` version, the `refactored` version and the tests showing that both have the same observable behavior.

| Language | Folder |
|---|---|
| Python | [`python/code_smells/change_preventers/shotgun_surgery/`](../../../python/code_smells/change_preventers/shotgun_surgery/) |
| C# | [`csharp/src/CodeSmells/ChangePreventers/ShotgunSurgery/`](../../../csharp/src/CodeSmells/ChangePreventers/ShotgunSurgery/) |
| React + TS | [`react-ts/src/smells/change_preventers/shotgun-surgery/`](../../../react-ts/src/smells/change_preventers/shotgun-surgery/) |
| Go | [`go/smells/change_preventers/shotgun-surgery/`](../../../go/smells/change_preventers/shotgun-surgery/) |
| Angular | [`angular/src/smells/change_preventers/shotgun-surgery/`](../../../angular/src/smells/change_preventers/shotgun-surgery/) |

## References

- Fowler, M. (1999). *Refactoring: Improving the Design of Existing Code*. Addison-Wesley (chapter 3, "Bad Smells in Code", written with Kent Beck).
- Fowler, M. (2018). *Refactoring: Improving the Design of Existing Code* (2nd ed.). Addison-Wesley. Refactoring catalog: https://refactoring.com/catalog/
- Mäntylä, M. V. and Lassenius, C. (2006). "Subjective evaluation of software evolvability using code smells: An empirical study". *Empirical Software Engineering*, 11(3), 395-431.
- Jerzyk, M. and Madeyski, L. (2023). *Code Smells: A Comprehensive Online Catalog and Taxonomy*. Online catalog: https://codesmells.org
- Refactoring.Guru — Shotgun Surgery: https://refactoring.guru/smells/shotgun-surgery
- Refactoring.Guru — Code Smells: https://refactoring.guru/refactoring/smells
- Fowler, M. — *CodeSmell* (bliki): https://martinfowler.com/bliki/CodeSmell.html
