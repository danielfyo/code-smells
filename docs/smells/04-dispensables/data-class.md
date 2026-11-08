# Data Class

> **ID:** CS018 · **Category:** Dispensables · **Sources:** Fowler 1999
>
> Classes with only fields and getters/setters, while the logic that manipulates them lives in other classes.

## Definition

A **data class** has only fields and accessor methods (getters/setters), while the logic operating on
that data lives in other classes. Fowler describes it as a "dumb data holder" that others manipulate in
far too much detail.

Not every data structure is a smell: DTOs, immutable records and messages are useful. The problem
appears when the class represents a domain concept with its own rules and those rules are spread across
the clients (the "anemic domain model" Fowler criticizes).

## Symptoms

- Classes with only public properties or getters/setters.
- Clients read several fields, compute something and write the result back.
- The same logic on the class repeated in several services.
- Public setters that allow the object to be left in invalid states.

## Common causes

- Designs driven by the database or the ORM.
- Architectures with "services" that hold all the logic.
- Separating data and behavior out of procedural habit.

## Why it is a problem

- The concept's invariants are not protected: anyone can modify the state.
- Duplicated logic in clients and feature envy.
- Changing the internal representation forces you to touch every client.

## Example (smelly)

```csharp
public class BankAccount
{
    public decimal Balance { get; set; }
    public bool IsFrozen { get; set; }
}

public class TransferService
{
    public void Withdraw(BankAccount acc, decimal amount)
    {
        if (acc.IsFrozen) throw new InvalidOperationException("frozen");
        if (acc.Balance < amount) throw new InvalidOperationException("funds");
        acc.Balance -= amount;
    }
}
```

## Solution (refactored)

```csharp
public class BankAccount
{
    public decimal Balance { get; private set; }
    public bool IsFrozen { get; private set; }

    public void Withdraw(decimal amount)
    {
        if (IsFrozen) throw new InvalidOperationException("frozen");
        if (Balance < amount) throw new InvalidOperationException("funds");
        Balance -= amount;
    }

    public void Freeze() => IsFrozen = true;
}
```

The behavior moves next to the data it uses and the setters are no longer public: the account protects its own invariants.

## Recommended refactorings

- **Encapsulate Record**: replaces public fields with controlled accessors.
- **Remove Setting Method**: removes setters from fields that should not change from outside.
- **Encapsulate Collection**: prevents clients from modifying internal collections.
- **Move Function**: moves into the class the logic that clients apply to its data.
- **Extract Function**: first isolates the part of the client logic that should move.

## When it may be acceptable

- DTOs, messages, events and immutable records at the system boundaries (APIs, queues, serialization).
- Intermediate results of a processing phase (*Split Phase*).
- Functional styles where data is immutable and functions live in modules (common in TypeScript and Go).

## Related smells

- [Feature Envy](../05-couplers/feature-envy.md) — the logic that should be in the data class envies its fields.
- [Large Class / God Class](../01-bloaters/large-class.md) — the God Class that manipulates the data classes.
- [Anemic Domain Model](../15-csharp/anemic-domain-model.md) — the architectural version in C#.
- [Java-style Getters and Setters](../14-python/java-style-getters-setters.md) — Python variant: trivial getters/setters.
- [Mutable Data](../06-data/mutable-data.md) — public setters invite unexpected mutations.

## Automatic detection

| Language | Tools and rules |
|---|---|
| Python | Pylint `R0903 too-few-public-methods` as a hint; review classes with only properties and services that manipulate them. |
| C# | `CA1051` (do not declare visible instance fields); `CA2227` (collection properties should be read-only); NDepend has queries for anemic models. |
| React + TS | `@typescript-eslint/prefer-readonly` and `Readonly<T>` types to prevent external mutations. |
| Go | No specific rule; structs with exported fields are idiomatic, the smell is in the scattered logic. |

## Implementations

Each folder contains the `smelly` version, the `refactored` version and the tests showing that both have the same observable behavior.

| Language | Folder |
|---|---|
| Python | [`python/code_smells/dispensables/data_class/`](../../../python/code_smells/dispensables/data_class/) |
| C# | [`csharp/src/CodeSmells/Dispensables/DataClass/`](../../../csharp/src/CodeSmells/Dispensables/DataClass/) |
| React + TS | [`react-ts/src/smells/dispensables/data-class/`](../../../react-ts/src/smells/dispensables/data-class/) |
| Go | [`go/smells/dispensables/data-class/`](../../../go/smells/dispensables/data-class/) |

## References

- Fowler, M. (1999). *Refactoring: Improving the Design of Existing Code*. Addison-Wesley (chapter 3, "Bad Smells in Code", written with Kent Beck).
- Fowler, M. (2018). *Refactoring: Improving the Design of Existing Code* (2nd ed.). Addison-Wesley. Refactoring catalog: https://refactoring.com/catalog/
- Mäntylä, M. V. and Lassenius, C. (2006). "Subjective evaluation of software evolvability using code smells: An empirical study". *Empirical Software Engineering*, 11(3), 395-431.
- Jerzyk, M. and Madeyski, L. (2023). *Code Smells: A Comprehensive Online Catalog and Taxonomy*. Online catalog: https://codesmells.org
- Fowler, M. — *AnemicDomainModel* (bliki): https://martinfowler.com/bliki/AnemicDomainModel.html
- Refactoring.Guru — Data Class: https://refactoring.guru/smells/data-class
- Refactoring.Guru — Code Smells: https://refactoring.guru/refactoring/smells
- Fowler, M. — *CodeSmell* (bliki): https://martinfowler.com/bliki/CodeSmell.html
