# Refused Bequest

> **ID:** CS008 · **Category:** Object-Orientation Abusers · **Sources:** Fowler 1999
>
> A subclass inherits methods and data it does not want or cannot use, violating the Liskov substitution principle.

## Definition

A **refused bequest** occurs when a subclass inherits methods or data from its base class that it does
not need, does not want or, worse, cannot honor: it overrides them with empty bodies, throws
`NotImplementedError` / `NotSupportedException`, or ignores part of the inherited state.

In its mild form it signals a poorly factored hierarchy. In its severe form, where the subclass refuses
the parent's **interface**, it violates the Liskov substitution principle: code that works with the
base class stops working when it receives that subclass.

## Symptoms

- Overridden methods that throw "not supported" or do nothing.
- The subclass only uses a small part of what it inherits.
- `isinstance`/`is` checks in clients to avoid calling certain methods.
- Inheritance was chosen to reuse code, not because there is an "is-a" relationship.

## Common causes

- Using inheritance as a code reuse mechanism.
- Hierarchies designed with one case in mind and extended to others that do not fit.
- Overly generous base classes that accumulate functionality from several subclasses.

## Why it is a problem

- Runtime errors when a subclass is treated as its base.
- Clients need to know the concrete type, breaking polymorphism.
- Confusing hierarchies that make it hard to understand what can be done with each object.

## Example (smelly)

```ts
class Account {
  constructor(protected balance: number) {}
  deposit(amount: number) { this.balance += amount; }
  withdraw(amount: number) { this.balance -= amount; }
}

class GiftCard extends Account {
  // SMELL: inherits deposit()... and refuses it
  override deposit(_amount: number): never {
    throw new Error("Gift cards cannot be topped up");
  }
}
```

## Solution (refactored)

```ts
interface Spendable { withdraw(amount: number): void; balance(): number }
interface Rechargeable { deposit(amount: number): void }

class Account implements Spendable, Rechargeable {
  constructor(private amount: number) {}
  deposit(n: number) { this.amount += n; }
  withdraw(n: number) { this.amount -= n; }
  balance() { return this.amount; }
}

class GiftCard implements Spendable {
  constructor(private amount: number) {}
  withdraw(n: number) { this.amount -= n; }
  balance() { return this.amount; }
}
```

Each type implements only the contracts it can honor; the compiler prevents topping up a gift card.

## Recommended refactorings

- **Replace Subclass with Delegate**: replaces inheritance with composition.
- **Replace Superclass with Delegate**: when the "is-a" relationship does not hold.
- **Push Down Method**: and **Push Down Field**: move what is not common down to the subclasses that use it.
- **Extract Superclass**: or extract smaller interfaces that reflect real capabilities.

## When it may be acceptable

- Harmless refusals of implementation (not interface): the subclass does not use an inherited helper, but the public contract is honored.
- Hierarchies imposed by a framework where you do not control the base class; document it in that case.

## Related smells

- [Base Class Depending on Its Derivatives](base-class-depends-on-subclass.md) — another sign of a poorly designed hierarchy.
- [Parallel Inheritance Hierarchies](../03-change-preventers/parallel-inheritance-hierarchies.md) — forced hierarchies that grow without fitting.
- [Switch Statements / Repeated Switches](switch-statements.md) — clients end up deciding by type to dodge the refusal.
- [Speculative Generality](../04-dispensables/speculative-generality.md) — generic base classes anticipating subclasses that do not exist.

## Automatic detection

| Language | Tools and rules |
|---|---|
| Python | Pylint `W0223 abstract-method` (abstract method not overridden) and searches for `raise NotImplementedError` in concrete subclasses. |
| C# | Search for `throw new NotSupportedException()`/`NotImplementedException()` in overrides; SonarQube `S1185` (overrides that only call `base`) as a hint of dubious hierarchies. |
| React + TS | No specific rule; look for `override` methods that throw or empty methods (`@typescript-eslint/no-empty-function`). |
| Go | There is no inheritance; the equivalent is embedding a type whose promoted methods make no sense. Review methods returning `errors.New("not supported")`. |

## Implementations

Each folder contains the `smelly` version, the `refactored` version and the tests showing that both have the same observable behavior.

| Language | Folder |
|---|---|
| Python | [`python/code_smells/oo_abusers/refused_bequest/`](../../../python/code_smells/oo_abusers/refused_bequest/) |
| C# | [`csharp/src/CodeSmells/OoAbusers/RefusedBequest/`](../../../csharp/src/CodeSmells/OoAbusers/RefusedBequest/) |
| React + TS | [`react-ts/src/smells/oo_abusers/refused-bequest/`](../../../react-ts/src/smells/oo_abusers/refused-bequest/) |
| Go | [`go/smells/oo_abusers/refused-bequest/`](../../../go/smells/oo_abusers/refused-bequest/) |

## References

- Fowler, M. (1999). *Refactoring: Improving the Design of Existing Code*. Addison-Wesley (chapter 3, "Bad Smells in Code", written with Kent Beck).
- Fowler, M. (2018). *Refactoring: Improving the Design of Existing Code* (2nd ed.). Addison-Wesley. Refactoring catalog: https://refactoring.com/catalog/
- Mäntylä, M. V. and Lassenius, C. (2006). "Subjective evaluation of software evolvability using code smells: An empirical study". *Empirical Software Engineering*, 11(3), 395-431.
- Jerzyk, M. and Madeyski, L. (2023). *Code Smells: A Comprehensive Online Catalog and Taxonomy*. Online catalog: https://codesmells.org
- Refactoring.Guru — Refused Bequest: https://refactoring.guru/smells/refused-bequest
- Refactoring.Guru — Code Smells: https://refactoring.guru/refactoring/smells
- Fowler, M. — *CodeSmell* (bliki): https://martinfowler.com/bliki/CodeSmell.html
