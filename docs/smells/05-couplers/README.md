# Couplers

> Excessive coupling between classes, or excessive delegation.

**Couplers** are smells that cause excessive coupling between classes or modules, or replace it with
excessive delegation. A module that knows too much about another (its data, its internal structure, its
order of use, its global state) cannot change without dragging the other along.

The goal is not to eliminate dependencies (a system without them does nothing), but to make them
**explicit, narrow and stable**: they should go through small interfaces, respect encapsulation ("tell,
don't ask"; Law of Demeter) and make ordering and shared state visible in the code. Beware of the
opposite extreme, though: the **middle man** shows that too much indirection is also a problem.

Besides Fowler and Beck's five classic couplers (Mäntylä and Lassenius's 2006 taxonomy), this category
includes *Global Data* and *Insider Trading* from the second edition of *Refactoring* (2018) and two
heuristics from *Clean Code* (G13 and G31).

## Smells in this category

| ID | Smell | Sources | Summary |
|---|---|---|---|
| CS023 | [**Feature Envy**](feature-envy.md) | Fowler 1999; Clean Code G14 | A method uses another class's data more than its own. |
| CS024 | [**Inappropriate Intimacy**](inappropriate-intimacy.md) | Fowler 1999 | A class accesses the internal details (private fields, state) of another. |
| CS025 | [**Message Chains (Train Wreck)**](message-chains.md) | Fowler 1999; Clean Code G36; Law of Demeter | Chains such as a.getB().getC().getD() that couple the client to the whole navigation structure. |
| CS026 | [**Middle Man**](middle-man.md) | Fowler 1999 | A class most of whose methods only delegate to another class. |
| CS027 | [**Incomplete Library Class**](incomplete-library-class.md) | Fowler 1999 | A library does not offer what you need and the extension logic ends up scattered across the code. |
| CS028 | [**Global Data**](global-data.md) | Fowler 2018 | Global state that can be modified from anywhere, impossible to trace and to test. |
| CS029 | [**Insider Trading**](insider-trading.md) | Fowler 2018 | Modules that secretly exchange internal data instead of using explicit interfaces. |
| CS030 | [**Artificial Coupling**](artificial-coupling.md) | Clean Code G13 | Elements that do not depend on each other are coupled because they are declared together (generic constants inside concrete classes). |
| CS031 | [**Hidden Temporal Coupling**](hidden-temporal-coupling.md) | Clean Code G31 | Calls must happen in a specific order, but nothing in the code enforces or reveals it. |

## How to use this folder

Every document follows the template in [`docs/CONVENTIONS.md`](../../CONVENTIONS.md): definition, symptoms, causes, consequences, a smelly snippet and its solution, recommended refactorings, exceptions, related smells, automatic detection and links to the implementations in Python, C#, React + TypeScript and Go. The full index is in [`docs/CATALOG.md`](../../CATALOG.md).
