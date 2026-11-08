# Duplicate Code

> **ID:** CS016 · **Category:** Dispensables · **Sources:** Fowler 1999; Clean Code G5 (DRY)
>
> The same piece of logic appears in several places; every change has to be replicated and it is easy to forget one.

## Definition

**Duplicate code** is, according to Fowler and Beck, number one in the stink parade: the same code
structure appears in more than one place. It may be a literal copy, a copy with small variations (names,
literals) or a duplication of **knowledge**: two different implementations of the same business rule.

*Clean Code* (G5) links it to Hunt and Thomas's DRY principle (*Don't Repeat Yourself*): every piece of
knowledge must have a single, unambiguous, authoritative representation within the system.

## Symptoms

- Identical or nearly identical blocks in several functions, classes or files.
- Bug fixes that must be applied in several places.
- Sibling subclasses with almost identical methods.
- Validations or calculations repeated in frontend and backend, or in several handlers.

## Common causes

- Copy and paste as a quick way of reusing code.
- Several developers solving the same problem without knowing it.
- Deadline pressure that prevents extracting abstractions.
- Fear of modifying shared code.

## Why it is a problem

- Changes must be replicated; sooner or later a copy falls behind and inconsistencies appear.
- More code to read, test and maintain.
- The common abstraction remains hidden and nameless.

## Example (smelly)

```python
def invoice_total(lines):
    total = 0
    for line in lines:
        total += line.price * line.qty
    if total > 100:
        total *= 0.95
    return round(total, 2)

def quote_total(lines):
    total = 0
    for line in lines:
        total += line.price * line.qty
    if total > 100:
        total *= 0.95
    return round(total, 2) + QUOTE_FEE
```

## Solution (refactored)

```python
def discounted_subtotal(lines):
    subtotal = sum(line.price * line.qty for line in lines)
    if subtotal > BULK_THRESHOLD:
        subtotal *= 1 - BULK_DISCOUNT
    return round(subtotal, 2)

def invoice_total(lines):
    return discounted_subtotal(lines)

def quote_total(lines):
    return discounted_subtotal(lines) + QUOTE_FEE
```

## Recommended refactorings

- **Extract Function**: the basic tool for unifying repeated fragments.
- **Pull Up Method**: when the duplication is in sibling subclasses.
- **Form Template Method**: if the copies share the same structure with different steps.
- **Slide Statements**: brings the identical parts together so they can be extracted.
- **Substitute Algorithm**: when two different algorithms solve the same problem: keep the clearer one.

## When it may be acceptable

- Accidental duplication: two fragments look alike today but represent concepts that will evolve separately (unifying them would create undue coupling).
- Tests, where some repetition improves the readability of each case (the DAMP principle).
- Rule of three: tolerate two copies and abstract when the third appears, while the right shape of the abstraction is still unclear.

## Related smells

- [Shotgun Surgery](../03-change-preventers/shotgun-surgery.md) — duplicated knowledge forces many places to change.
- [Alternative Classes with Different Interfaces](../02-oo-abusers/alternative-classes-different-interfaces.md) — duplication across equivalent classes.
- [Combinatorial Explosion](../03-change-preventers/combinatorial-explosion.md) — duplication multiplied by combinations.
- [Magic Numbers / Magic Strings](../06-data/magic-numbers.md) — repeated literals are a form of duplication.
- [Reinventing the Standard Library](../14-python/reinventing-stdlib.md) — duplicating what the standard library already offers.

## Automatic detection

| Language | Tools and rules |
|---|---|
| Python | Pylint `R0801 duplicate-code` (similarities across files); `jscpd` also analyzes Python. |
| C# | SonarQube duplicated-block detection (*Duplicated Lines* metric); `S4144` (identical methods) and `S1871` (branches with the same code). |
| React + TS | `jscpd`; `sonarjs/no-identical-functions`, `sonarjs/no-duplicated-branches`. |
| Go | golangci-lint `dupl`; gocritic `dupBranchBody`. |

## Implementations

Each folder contains the `smelly` version, the `refactored` version and the tests showing that both have the same observable behavior.

| Language | Folder |
|---|---|
| Python | [`python/code_smells/dispensables/duplicate_code/`](../../../python/code_smells/dispensables/duplicate_code/) |
| C# | [`csharp/src/CodeSmells/Dispensables/DuplicateCode/`](../../../csharp/src/CodeSmells/Dispensables/DuplicateCode/) |
| React + TS | [`react-ts/src/smells/dispensables/duplicate-code/`](../../../react-ts/src/smells/dispensables/duplicate-code/) |
| Go | [`go/smells/dispensables/duplicate-code/`](../../../go/smells/dispensables/duplicate-code/) |

## References

- Fowler, M. (1999). *Refactoring: Improving the Design of Existing Code*. Addison-Wesley (chapter 3, "Bad Smells in Code", written with Kent Beck).
- Fowler, M. (2018). *Refactoring: Improving the Design of Existing Code* (2nd ed.). Addison-Wesley. Refactoring catalog: https://refactoring.com/catalog/
- Martin, R. C. (2008). *Clean Code: A Handbook of Agile Software Craftsmanship*. Prentice Hall (chapter 17, "Smells and Heuristics").
- Mäntylä, M. V. and Lassenius, C. (2006). "Subjective evaluation of software evolvability using code smells: An empirical study". *Empirical Software Engineering*, 11(3), 395-431.
- Jerzyk, M. and Madeyski, L. (2023). *Code Smells: A Comprehensive Online Catalog and Taxonomy*. Online catalog: https://codesmells.org
- Hunt, A. and Thomas, D. (1999). *The Pragmatic Programmer*. Addison-Wesley (DRY principle).
- Refactoring.Guru — Duplicate Code: https://refactoring.guru/smells/duplicate-code
- Refactoring.Guru — Code Smells: https://refactoring.guru/refactoring/smells
- Fowler, M. — *CodeSmell* (bliki): https://martinfowler.com/bliki/CodeSmell.html
