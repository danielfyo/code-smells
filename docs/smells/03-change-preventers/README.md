# Change Preventers

> A change in one place forces many changes in other places.

**Change Preventers** are structures in which a change in one place forces many changes elsewhere. The
system becomes rigid: every modification costs more than it should and carries a high risk of forgetting
a piece.

Fowler presents them as complementary pairs: **divergent change** (one class changes for many reasons)
and **shotgun surgery** (one reason forces many classes to change). Both indicate that responsibilities
are not aligned with the business's axes of change. **Parallel inheritance hierarchies** and
**combinatorial explosion** are variants in which the type structure multiplies the work.

The goal when refactoring is that **each design decision lives in a single place** and each module has a
single reason to change (single responsibility principle).

## Smells in this category

| ID | Smell | Sources | Summary |
|---|---|---|---|
| CS012 | [**Divergent Change**](divergent-change.md) | Fowler 1999 | The same class is modified for many different reasons (it violates the single responsibility principle). |
| CS013 | [**Shotgun Surgery**](shotgun-surgery.md) | Fowler 1999 | A single conceptual change forces small modifications in many different classes. |
| CS014 | [**Parallel Inheritance Hierarchies**](parallel-inheritance-hierarchies.md) | Fowler 1999 | Every time you create a subclass in one hierarchy you have to create another in a parallel hierarchy. |
| CS015 | [**Combinatorial Explosion**](combinatorial-explosion.md) | Kerievsky 2004; Jerzyk 2023 | Many pieces of code do the same thing with different combinations of data or behavior. |

## How to use this folder

Every document follows the template in [`docs/CONVENTIONS.md`](../../CONVENTIONS.md): definition, symptoms, causes, consequences, a smelly snippet and its solution, recommended refactorings, exceptions, related smells, automatic detection and links to the implementations in Python, C#, React + TypeScript and Go. The full index is in [`docs/CATALOG.md`](../../CATALOG.md).
