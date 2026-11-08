# Bloaters

> Code, methods and classes that have grown so large they are hard to work with.

**Bloaters** are pieces of code (methods, classes, parameter lists or groups of data) that have grown
to an unmanageable size. They rarely appear all at once: they accumulate little by little, commit after
commit, because "adding one more line" always looks cheaper than reorganizing.

Their cost is cognitive: they force the reader to keep too much context in mind, they make unit testing
harder and they hide domain concepts that deserve a name of their own. Almost all of them are fixed with
extraction refactorings (*Extract Function*, *Extract Class*, *Introduce Parameter Object*,
*Replace Primitive with Object*) that bring those hidden abstractions to the surface.

This category comes from Mäntylä and Lassenius's (2006) taxonomy of Fowler and Beck's smells.

## Smells in this category

| ID | Smell | Sources | Summary |
|---|---|---|---|
| CS001 | [**Long Method**](long-method.md) | Fowler 1999; Clean Code G30 | A function does too many things and spans too many lines; the longer it is, the harder it is to understand, test and reuse. |
| CS002 | [**Large Class / God Class**](large-class.md) | Fowler 1999; Riel 1996 | A class with too many fields, methods and responsibilities that knows and does everything. |
| CS003 | [**Long Parameter List**](long-parameter-list.md) | Fowler 1999; Clean Code F1 | Functions with more than three or four parameters, hard to call correctly and hard to read. |
| CS004 | [**Primitive Obsession**](primitive-obsession.md) | Fowler 1999 | Using primitive types (string, int) for domain concepts such as money, emails or ranges instead of dedicated types. |
| CS005 | [**Data Clumps**](data-clumps.md) | Fowler 1999 | The same groups of variables travel together everywhere (street, city, postal code) without being grouped into an object. |

## How to use this folder

Every document follows the template in [`docs/CONVENTIONS.md`](../../CONVENTIONS.md): definition, symptoms, causes, consequences, a smelly snippet and its solution, recommended refactorings, exceptions, related smells, automatic detection and links to the implementations in Python, C#, React + TypeScript and Go. The full index is in [`docs/CATALOG.md`](../../CATALOG.md).
