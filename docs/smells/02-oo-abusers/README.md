# Object-Orientation Abusers

> Incomplete or incorrect application of object-oriented programming principles.

**Object-Orientation Abusers** are incomplete or incorrect applications of object-oriented principles:
`switch` statements on type codes where polymorphism would fit, inheritance used only to reuse code,
fields that only make sense some of the time, interchangeable classes with incompatible interfaces, or
statics that prevent dependencies from being substituted.

What they have in common is that the design **does not take advantage of** (or contradicts) the
mechanisms the paradigm offers to manage variation: polymorphism, encapsulation, Liskov substitution and
dependency inversion. Although the names come from the world of classes, all of them have equivalents
in Go (implicit interfaces, embedding) and in TypeScript/React (discriminated unions, hooks, modules).

The category comes from Mäntylä and Lassenius's (2006) taxonomy and is complemented with heuristics
from *Clean Code* (G7, G18).

## Smells in this category

| ID | Smell | Sources | Summary |
|---|---|---|---|
| CS006 | [**Switch Statements / Repeated Switches**](switch-statements.md) | Fowler 1999/2018; Clean Code G23 | The same switch or if/else chain on a type is repeated in several places; every new type forces you to touch all of them. |
| CS007 | [**Temporary Field**](temporary-field.md) | Fowler 1999 | Fields that only hold a value in certain circumstances and are empty the rest of the time. |
| CS008 | [**Refused Bequest**](refused-bequest.md) | Fowler 1999 | A subclass inherits methods and data it does not want or cannot use, violating the Liskov substitution principle. |
| CS009 | [**Alternative Classes with Different Interfaces**](alternative-classes-different-interfaces.md) | Fowler 1999 | Two classes do the same thing but with different names and signatures, which prevents swapping them. |
| CS010 | [**Base Class Depending on Its Derivatives**](base-class-depends-on-subclass.md) | Clean Code G7 | A base class knows about or references its subclasses, breaking the hierarchy and the open/closed principle. |
| CS011 | [**Inappropriate Static**](inappropriate-static.md) | Clean Code G18 | Static functions that should be polymorphic or that hide dependencies, making them hard to replace and test. |

## How to use this folder

Every document follows the template in [`docs/CONVENTIONS.md`](../../CONVENTIONS.md): definition, symptoms, causes, consequences, a smelly snippet and its solution, recommended refactorings, exceptions, related smells, automatic detection and links to the implementations in Python, C#, React + TypeScript and Go. The full index is in [`docs/CATALOG.md`](../../CATALOG.md).
