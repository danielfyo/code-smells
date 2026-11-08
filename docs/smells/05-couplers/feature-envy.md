# Feature Envy

> **ID:** CS023 · **Category:** Couplers · **Sources:** Fowler 1999; Clean Code G14
>
> A method uses another class's data more than its own.

## Definition

**Feature envy** occurs when a method seems more interested in another class's data than in its own: it
calls several getters on another object, does calculations with those values and barely uses
`self`/`this`. *Clean Code* (G14) uses the same image: the method envies the scope of another class.

Fowler's rule is to put together things that change together: data and the behavior that uses it should
live in the same place.

## Symptoms

- A method accesses many fields or getters of another object and few or none of its own.
- Chains of reads on the same parameter: `order.customer.address.city`, `order.lines`, `order.discount`...
- Methods that could be static because they do not use their class's state.
- The same logic on an object repeated in several services.

## Common causes

- Data classes without behavior whose data others manipulate.
- "Service" architectures that concentrate logic outside the entities.
- Adding logic where it is needed instead of where it belongs.

## Why it is a problem

- It breaks encapsulation: representation changes affect other classes.
- Duplicated logic over the same data.
- Low cohesion in both classes.

## Example (smelly)

```python
class InvoicePrinter:
    def line_total(self, line) -> float:
        # SMELL: only uses data from `line`
        gross = line.unit_price * line.quantity
        if line.discount_percent:
            gross -= gross * line.discount_percent / 100
        return round(gross, 2)
```

## Solution (refactored)

```python
class InvoiceLine:
    def __init__(self, unit_price, quantity, discount_percent=0):
        self.unit_price = unit_price
        self.quantity = quantity
        self.discount_percent = discount_percent

    def total(self) -> float:
        gross = self.unit_price * self.quantity
        return round(gross * (1 - self.discount_percent / 100), 2)

class InvoicePrinter:
    def line_total(self, line: InvoiceLine) -> float:
        return line.total()
```

## Recommended refactorings

- **Move Function**: moves the method to the class whose data it uses.
- **Extract Function**: isolates the envious part when only a fragment of the method suffers from it, then moves it.
- **Move Field**: if it is the data that is in the wrong place.

## When it may be acceptable

- Patterns that deliberately separate data and behavior: *Strategy*, *Visitor*, serializers, mappers.
- Functional code with immutable data and functions in modules (idiomatic in Go or TypeScript).
- When the envied class belongs to an external library that cannot be modified.

## Related smells

- [Data Class](../04-dispensables/data-class.md) — the data class is the usual victim of envy.
- [Inappropriate Intimacy](inappropriate-intimacy.md) — extreme envy reaches private details.
- [Message Chains (Train Wreck)](message-chains.md) — envy often walks along chains of objects.
- [Misplaced Responsibility](../11-general/misplaced-responsibility.md) — code placed in the wrong spot in general.

## Automatic detection

| Language | Tools and rules |
|---|---|
| Python | No direct rule; Pylint `R6301 no-self-use` (extension `pylint.extensions.no_self_use`) flags methods that do not use `self`, a frequent hint. |
| C# | `CA1822` (member can be marked `static`) hints that the method does not use its class; NDepend can query metrics on access to other types' data. |
| React + TS | ESLint `class-methods-use-this` as a hint in classes. |
| Go | revive `unused-receiver` flags methods that do not use their receiver. |

Specialized research tools use metrics such as ATFD (*Access To Foreign Data*); day to day, the hints above are enough to trigger a review.

## Implementations

Each folder contains the `smelly` version, the `refactored` version and the tests showing that both have the same observable behavior.

| Language | Folder |
|---|---|
| Python | [`python/code_smells/couplers/feature_envy/`](../../../python/code_smells/couplers/feature_envy/) |
| C# | [`csharp/src/CodeSmells/Couplers/FeatureEnvy/`](../../../csharp/src/CodeSmells/Couplers/FeatureEnvy/) |
| React + TS | [`react-ts/src/smells/couplers/feature-envy/`](../../../react-ts/src/smells/couplers/feature-envy/) |
| Go | [`go/smells/couplers/feature-envy/`](../../../go/smells/couplers/feature-envy/) |
| Angular | [`angular/src/smells/couplers/feature-envy/`](../../../angular/src/smells/couplers/feature-envy/) |

## References

- Fowler, M. (1999). *Refactoring: Improving the Design of Existing Code*. Addison-Wesley (chapter 3, "Bad Smells in Code", written with Kent Beck).
- Fowler, M. (2018). *Refactoring: Improving the Design of Existing Code* (2nd ed.). Addison-Wesley. Refactoring catalog: https://refactoring.com/catalog/
- Martin, R. C. (2008). *Clean Code: A Handbook of Agile Software Craftsmanship*. Prentice Hall (chapter 17, "Smells and Heuristics").
- Mäntylä, M. V. and Lassenius, C. (2006). "Subjective evaluation of software evolvability using code smells: An empirical study". *Empirical Software Engineering*, 11(3), 395-431.
- Jerzyk, M. and Madeyski, L. (2023). *Code Smells: A Comprehensive Online Catalog and Taxonomy*. Online catalog: https://codesmells.org
- Refactoring.Guru — Feature Envy: https://refactoring.guru/smells/feature-envy
- Refactoring.Guru — Code Smells: https://refactoring.guru/refactoring/smells
- Fowler, M. — *CodeSmell* (bliki): https://martinfowler.com/bliki/CodeSmell.html
