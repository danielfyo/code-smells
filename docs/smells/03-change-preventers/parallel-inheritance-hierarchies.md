# Parallel Inheritance Hierarchies

> **ID:** CS014 · **Category:** Change Preventers · **Sources:** Fowler 1999
>
> Every time you create a subclass in one hierarchy you have to create another in a parallel hierarchy.

## Definition

**Parallel inheritance hierarchies** are a special case of shotgun surgery: every time a subclass is
created in one hierarchy, a corresponding subclass must be created in another. You can recognize them
because the name prefixes match in both (`PdfReport`/`PdfExporter`, `CarInsurance`/`CarInsuranceForm`).

Both hierarchies encode the same axis of variation and are therefore doomed to grow together.

## Symptoms

- Two hierarchies with one-to-one paired subclasses and names sharing the same prefix.
- Factories that create the corresponding "partner" with a `switch` on the type.
- Adding a variant always means creating two (or more) classes.

## Common causes

- Separating data and behavior into different hierarchies (e.g. model and view, entity and validator).
- Applying patterns such as *Visitor* or *Abstract Factory* without need.
- Evolution by copying an existing hierarchy.

## Why it is a problem

- The cost of each new variant doubles.
- Risk of mismatches: a variant without its partner causes runtime errors.
- More classes and more indirection than necessary.

## Example (smelly)

```csharp
public abstract class Employee { public abstract decimal BaseSalary { get; } }
public class Engineer : Employee { public override decimal BaseSalary => 3000m; }
public class Manager  : Employee { public override decimal BaseSalary => 4000m; }

// SMELL: every new employee type needs its own calculator
public abstract class BonusCalculator { public abstract decimal Bonus(Employee e); }
public class EngineerBonus : BonusCalculator { public override decimal Bonus(Employee e) => e.BaseSalary * 0.1m; }
public class ManagerBonus  : BonusCalculator { public override decimal Bonus(Employee e) => e.BaseSalary * 0.2m; }
```

## Solution (refactored)

```csharp
public abstract class Employee
{
    public abstract decimal BaseSalary { get; }
    protected abstract decimal BonusRate { get; }
    public decimal Bonus() => BaseSalary * BonusRate;
}

public class Engineer : Employee
{
    public override decimal BaseSalary => 3000m;
    protected override decimal BonusRate => 0.1m;
}

public class Manager : Employee
{
    public override decimal BaseSalary => 4000m;
    protected override decimal BonusRate => 0.2m;
}
```

The secondary hierarchy disappears: the bonus behavior moves into the main hierarchy.

## Recommended refactorings

- **Move Function**: and **Move Field**: move behavior from one hierarchy to the other until the second one is empty.
- **Replace Subclass with Delegate**: if the partner's variation can be expressed through composition.
- **Collapse Hierarchy**: removes the resulting empty classes.

## When it may be acceptable

- Deliberate separation between layers (domain and presentation) where merging them would violate the architecture; it can be mitigated with conventions or code generation.
- Conscious use of the *Visitor* pattern over a stable hierarchy.

## Related smells

- [Shotgun Surgery](shotgun-surgery.md) — it is a special case: one change forces you to touch two hierarchies.
- [Combinatorial Explosion](combinatorial-explosion.md) — when hierarchies cross instead of pairing up.
- [Switch Statements / Repeated Switches](../02-oo-abusers/switch-statements.md) — factories that pair classes are usually `switch` statements.
- [Refused Bequest](../02-oo-abusers/refused-bequest.md) — forced hierarchies that end up refusing part of their inheritance.

## Automatic detection

| Language | Tools and rules |
|---|---|
| Python | No specific rule; look for repeated prefixes between subclasses of two hierarchies. |
| C# | NDepend allows CQLinq queries over hierarchies; in practice it is caught in review. |
| React + TS | No specific rule; it shows up as pairs of components or classes with the same prefix. |
| Go | No inheritance; the equivalent is pairs of types implementing two parallel interfaces that are always added together. |

There are no standard linter rules for this smell; parallel naming and a history of joint changes are the best clues.

## Implementations

Each folder contains the `smelly` version, the `refactored` version and the tests showing that both have the same observable behavior.

| Language | Folder |
|---|---|
| Python | [`python/code_smells/change_preventers/parallel_inheritance_hierarchies/`](../../../python/code_smells/change_preventers/parallel_inheritance_hierarchies/) |
| C# | [`csharp/src/CodeSmells/ChangePreventers/ParallelInheritanceHierarchies/`](../../../csharp/src/CodeSmells/ChangePreventers/ParallelInheritanceHierarchies/) |
| React + TS | [`react-ts/src/smells/change_preventers/parallel-inheritance-hierarchies/`](../../../react-ts/src/smells/change_preventers/parallel-inheritance-hierarchies/) |
| Go | [`go/smells/change_preventers/parallel-inheritance-hierarchies/`](../../../go/smells/change_preventers/parallel-inheritance-hierarchies/) |
| Angular | [`angular/src/smells/change_preventers/parallel-inheritance-hierarchies/`](../../../angular/src/smells/change_preventers/parallel-inheritance-hierarchies/) |

## References

- Fowler, M. (1999). *Refactoring: Improving the Design of Existing Code*. Addison-Wesley (chapter 3, "Bad Smells in Code", written with Kent Beck).
- Fowler, M. (2018). *Refactoring: Improving the Design of Existing Code* (2nd ed.). Addison-Wesley. Refactoring catalog: https://refactoring.com/catalog/
- Mäntylä, M. V. and Lassenius, C. (2006). "Subjective evaluation of software evolvability using code smells: An empirical study". *Empirical Software Engineering*, 11(3), 395-431.
- Jerzyk, M. and Madeyski, L. (2023). *Code Smells: A Comprehensive Online Catalog and Taxonomy*. Online catalog: https://codesmells.org
- Refactoring.Guru — Parallel Inheritance Hierarchies: https://refactoring.guru/smells/parallel-inheritance-hierarchies
- Refactoring.Guru — Code Smells: https://refactoring.guru/refactoring/smells
- Fowler, M. — *CodeSmell* (bliki): https://martinfowler.com/bliki/CodeSmell.html
