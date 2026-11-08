# Prefer Structure over Convention

> **ID:** CS074 · **Category:** General · **Sources:** Clean Code G27

*Relying on conventions ("remember to add a case") instead of letting the structure enforce them.*

## Definition

The design relies on programmers remembering a convention ("when you add a payment type, also add a `case`
to these three `switch` statements") instead of having the code structure enforce it. *Clean Code* (G27,
*Structure over Convention*) states that design conventions should be backed by structure: an abstract method
forces implementation; a `switch` over enum names does not.

## Symptoms

- Comments like "remember to also update X".
- `switch`/`if-else` over the same enum repeated in several places.
- Manual registration of components in lists that are easy to forget.
- Run-time errors (`default: throw`) when a new case is added.

## Common causes

- Quick solutions that were not redesigned as the number of cases grew.
- Unfamiliarity with polymorphism or with compiler exhaustiveness checking.

## Why it is a problem

- **Omissions** that cause production errors.
- **Tribal knowledge**: only veterans know what needs to be touched.
- Shotgun surgery every time a new case appears.

## Example (smelly)

```typescript
type PaymentMethod = "card" | "transfer" | "paypal";

// SMELL: "if you add a method, remember to add it here and in fee()"
function label(method: PaymentMethod): string {
  switch (method) {
    case "card": return "Card";
    case "transfer": return "Bank transfer";
    default: return "Unknown"; // paypal falls through here and nobody notices
  }
}
```

## Solution (refactored)

```typescript
type PaymentMethod = "card" | "transfer" | "paypal";

interface PaymentInfo { label: string; feePercent: number }

// REFACTOR: Record requires an entry per method; forgetting one does not compile
const PAYMENT_INFO: Record<PaymentMethod, PaymentInfo> = {
  card: { label: "Card", feePercent: 1.5 },
  transfer: { label: "Bank transfer", feePercent: 0 },
  paypal: { label: "PayPal", feePercent: 2.9 },
};

const label = (method: PaymentMethod) => PAYMENT_INFO[method].label;
```

## Recommended refactorings

- **Replace Conditional with Polymorphism**, with abstract methods the compiler forces you to implement.
- **Replace Type Code with Subclasses**.
- Use **exhaustiveness checks** (`never` in TypeScript, `match` with `assert_never` in Python, `switch` expressions in C#) or typed tables.
- Replace manual registries with automatic discovery or with tests verifying that every case is covered.

## When it may be acceptable

- Framework conventions validated by the framework itself (file-based routing, ASP.NET conventions).
- A single `switch` in the whole system, well covered by tests.

## Related smells

- [Switch Statements / Repeated Switches](../02-oo-abusers/switch-statements.md): repeated `switch` statements are the classic symptom.
- [Shotgun Surgery](../03-change-preventers/shotgun-surgery.md): a new case forces changes in many places.
- [Logical Dependency Not Made Physical](hidden-logical-dependency.md): dependencies that exist only in the team's heads.
- [Hidden Temporal Coupling](../05-couplers/hidden-temporal-coupling.md): conventions about call order.

## Automatic detection

- **Python**: mypy/Pyright with `typing.assert_never` in `match`/`if` over `Enum` or `Literal`; Pyright `reportMatchNotExhaustive`.
- **C#**: compiler warning `CS8509` (non-exhaustive `switch` expression) and SonarQube `S131` (missing `default`).
- **TypeScript**: `@typescript-eslint/switch-exhaustiveness-check` and the `const _exhaustive: never = value` pattern.
- **Go**: golangci-lint's `exhaustive` linter checks that `switch` statements over enums cover every constant.

## Implementations

- Python: [`python/code_smells/general/convention_over_structure/`](../../../python/code_smells/general/convention_over_structure/)
- C#: [`csharp/src/CodeSmells/General/ConventionOverStructure/`](../../../csharp/src/CodeSmells/General/ConventionOverStructure/)
- React + TS: [`react-ts/src/smells/general/convention-over-structure/`](../../../react-ts/src/smells/general/convention-over-structure/)
- Go: [`go/smells/general/convention-over-structure/`](../../../go/smells/general/convention-over-structure/)
- Angular: [`angular/src/smells/general/convention-over-structure/`](../../../angular/src/smells/general/convention-over-structure/)

Each folder contains a `smelly` version (the smell, marked with `SMELL:` comments) and a `refactored` version (marked with `REFACTOR:` comments), plus tests showing that both have the same observable behavior.

## References

- Martin, R. C. (2008). *Clean Code*, ch. 17 "Smells and Heuristics". Prentice Hall.
- Fowler, M. (2018). *Refactoring: Improving the Design of Existing Code* (2nd ed.). Addison-Wesley. Refactoring catalog: https://refactoring.com/catalog/
- Jerzyk, M. and Madeyski, L. (2023). "Code Smells: A Comprehensive Online Catalog and Taxonomy". Online catalog: https://codesmells.org
