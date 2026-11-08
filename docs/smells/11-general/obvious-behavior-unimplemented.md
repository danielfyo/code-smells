# Obvious Behavior Is Unimplemented

> **ID:** CS067 · **Category:** General · **Sources:** Clean Code G2 (principle of least surprise)

*A function does not do what anyone would expect from its name or type.*

## Definition

A function or class does not implement the behavior that any programmer would reasonably expect from its
name, type or context. *Clean Code* (G2) ties this to the **principle of least surprise**: if
`Day.fromName("monday")` does not accept lowercase input, or an `equals` is not symmetric, users stop
trusting the abstraction and must read the implementation for every detail.

## Symptoms

- Converters that accept only one very specific format (exact capitalization, no whitespace).
- Value objects without structural equality (`Money(10) != Money(10)`).
- Custom collections that cannot be iterated, compared or printed the usual way for the language.
- Callers adding "fixes" around the function (`name.strip().upper()` before every call).

## Common causes

- Implementing only the case the first client needed.
- Not designing the API from the user's point of view.
- Unfamiliarity with language protocols (`__eq__`/`__hash__`, `Equals`/`GetHashCode`, `Stringer`).

## Why it is a problem

- **Bugs** when intuitive use silently produces a wrong result.
- **Duplicated defensive code** in every caller.
- Loss of trust in the API.

## Example (smelly)

```python
class Money:
    def __init__(self, amount: Decimal, currency: str):
        self.amount = amount
        self.currency = currency
    # SMELL: without __eq__, Money(Decimal("10"), "EUR") != Money(Decimal("10"), "EUR")


def parse_weekday(name: str) -> Weekday:
    # SMELL: "Monday" or " monday " fail even though anyone would expect them to work
    return Weekday[name]
```

## Solution (refactored)

```python
@dataclass(frozen=True)
class Money:
    # REFACTOR: value-based equality and hashing, as expected of a value object
    amount: Decimal
    currency: str


def parse_weekday(name: str) -> Weekday:
    # REFACTOR: accepts the obvious spelling variants
    return Weekday[name.strip().upper()]
```

## Recommended refactorings

- **Change Reference to Value** to give value objects structural equality.
- **Substitute Algorithm** with one that covers the obvious cases.
- **Move Function** to centralize normalization in the abstraction itself rather than in callers.
- Write **tests from the API user's point of view** that document the expected cases.

## When it may be acceptable

- When the restriction is deliberate and part of the contract (e.g. a strict parser for a standard format), documented and with a clear error.
- Low-level internal APIs with a single known caller.

## Related smells

- [Fallacious Method Name](../10-names/fallacious-method-name.md): the name promises more than is delivered.
- [Incomplete Library Class](../05-couplers/incomplete-library-class.md): the library does not offer what one would expect of it.
- [Be Precise / Imprecision](imprecision.md): unverified assumptions about the input.
- [Primitive Obsession](../01-bloaters/primitive-obsession.md): well-implemented value objects solve both problems.

## Automatic detection

- **Python**: Pylint `W0221`/`W0222` (inconsistent overridden signatures) and Ruff `PLW1641` (`__eq__` without `__hash__`); dataclasses and `attrs` generate equality automatically.
- **C#**: `CA1066`/`CA1067` (implement `IEquatable<T>` and override `Equals` consistently) and compiler warning `CS0659` (`Equals` without `GetHashCode`); `record` types provide value equality.
- **TypeScript / Go**: no direct rule; contract tests and API review.

In general, this smell is found by writing tests from the API consumer's perspective.

## Implementations

- Python: [`python/code_smells/general/obvious_behavior_unimplemented/`](../../../python/code_smells/general/obvious_behavior_unimplemented/)
- C#: [`csharp/src/CodeSmells/General/ObviousBehaviorUnimplemented/`](../../../csharp/src/CodeSmells/General/ObviousBehaviorUnimplemented/)
- React + TS: [`react-ts/src/smells/general/obvious-behavior-unimplemented/`](../../../react-ts/src/smells/general/obvious-behavior-unimplemented/)
- Go: [`go/smells/general/obvious-behavior-unimplemented/`](../../../go/smells/general/obvious-behavior-unimplemented/)
- Angular: [`angular/src/smells/general/obvious-behavior-unimplemented/`](../../../angular/src/smells/general/obvious-behavior-unimplemented/)

Each folder contains a `smelly` version (the smell, marked with `SMELL:` comments) and a `refactored` version (marked with `REFACTOR:` comments), plus tests showing that both have the same observable behavior.

## References

- Martin, R. C. (2008). *Clean Code*, ch. 17 "Smells and Heuristics". Prentice Hall.
- Fowler, M. (2018). *Refactoring: Improving the Design of Existing Code* (2nd ed.). Addison-Wesley. Refactoring catalog: https://refactoring.com/catalog/
- Jerzyk, M. and Madeyski, L. (2023). "Code Smells: A Comprehensive Online Catalog and Taxonomy". Online catalog: https://codesmells.org
- Hunt, A. and Thomas, D. (2019). *The Pragmatic Programmer* (20th anniversary ed.). Addison-Wesley.
