# Type Checking with type()

> **ID:** CS101 · **Category:** Python-specific · **Sources:** PEP 8

## Definition

Behaviour is decided by comparing an object's exact type: `if type(x) == SomeClass:` or `type(x) is dict`. This
comparison ignores inheritance, so subclasses (which should be substitutable for their base class) are treated as
unknown types. It is also frequently the symptom of an `if` chain over types that should be resolved with
polymorphism.

## Symptoms

- `if type(payment) == CardPayment: ... elif type(payment) == PayPalPayment: ...`.
- `type(value) == type([])` or `type(x) is int` in validations.
- Failures when passing a subclass (`OrderedDict`, `defaultdict`, `bool` as `int`, a test subclass).
- Functions that must be edited every time a new type is added.

## Common causes

- Not knowing `isinstance` or the abstract base classes in `collections.abc`.
- Literally translating a `switch` on a "type" field.
- Trying to "enforce" input types as in a statically typed language.

## Why it is a problem

- **Breaks the Liskov Substitution Principle**: a valid subclass is rejected.
- **Prevents duck typing**: objects that behave the same but are not of that exact type are refused.
- **Violates Open/Closed**: each new type forces changes to every `if` chain.
- Scattered logic: each type's behaviour lives outside the type itself.

## How it works under the hood

`type(obj)` returns the object's concrete class, and `==` / `is` between classes is only true if they are **the
same** class. `isinstance(obj, Cls)` walks the MRO (`Cls in type(obj).__mro__`) and also honours *virtual abstract
base classes*: `isinstance(x, collections.abc.Mapping)` is true for any type that is registered or implements the
protocol via `__subclasshook__`. So `isinstance` accepts subclasses and protocols, while `type() ==` excludes them.
For type-based dispatch there is `functools.singledispatch` and, since Python 3.10, `match` with class patterns
(`case CardPayment():`), which also use `isinstance` internally.

## Example (smelly)

```python
class Payment: ...
class CardPayment(Payment):
    def __init__(self, amount: float) -> None: self.amount = amount
class PayPalPayment(Payment):
    def __init__(self, amount: float) -> None: self.amount = amount
class CorporateCardPayment(CardPayment): ...


def fee(payment: Payment) -> float:
    # SMELL: exact type comparison; CorporateCardPayment falls through to the error
    if type(payment) == CardPayment:
        return payment.amount * 0.015
    if type(payment) == PayPalPayment:
        return payment.amount * 0.029 + 0.35
    raise TypeError("Unknown payment method")
```

## Solution (refactored)

```python
from abc import ABC, abstractmethod


class Payment(ABC):
    def __init__(self, amount: float) -> None:
        self.amount = amount

    @abstractmethod
    def fee(self) -> float: ...


class CardPayment(Payment):
    def fee(self) -> float:          # REFACTOR: each type knows its own fee
        return self.amount * 0.015


class PayPalPayment(Payment):
    def fee(self) -> float:
        return self.amount * 0.029 + 0.35


class CorporateCardPayment(CardPayment): ...   # inherits fee() with no changes
```

## Recommended refactorings

- **Replace Conditional with Polymorphism**: move each branch into a method of the corresponding type.
- **`isinstance`** with base classes or `collections.abc` ABCs when a type check is truly required.
- **`functools.singledispatch`** when the classes cannot be modified (third-party types).
- **Duck typing / `typing.Protocol`**: depend on behaviour, not on the nominal type.

## When it may be acceptable

- Implementing `__eq__` or serializers that want **exactly** the same type (`type(self) is type(other)`), for
  example to avoid treating instances of different subclasses as equal.
- Explicitly distinguishing `bool` from `int` (`type(x) is bool`), since `bool` is a subclass of `int`.

## Related smells

- [Switch Statements / Repeated Switches](../02-oo-abusers/switch-statements.md)
- [Refused Bequest](../02-oo-abusers/refused-bequest.md)
- [Using `is` for Value Comparison](identity-vs-equality.md)
- [Feature Envy](../05-couplers/feature-envy.md)

## Automatic detection

- **pycodestyle / Ruff** `E721` (type comparison with `==`; use `is` or `isinstance`).
- **Pylint** `C0123` `unidiomatic-typecheck`.
- Long `if isinstance` chains are not flagged by any standard linter; they are found in review or through complexity
  metrics (McCabe, Ruff `C901`).

## Implementations

- Python: [`python/code_smells/python_specific/type_checking_with_type/`](../../../python/code_smells/python_specific/type_checking_with_type/)

Python-specific smell: there is no implementation in the other languages of the repository.

## References

- PEP 8, *Programming Recommendations* ("Object type comparisons should always use isinstance()"):
  https://peps.python.org/pep-0008/#programming-recommendations
- Python docs, `isinstance`: https://docs.python.org/3/library/functions.html#isinstance
- Python docs, `functools.singledispatch`: https://docs.python.org/3/library/functools.html#functools.singledispatch
- Python docs, `collections.abc`: https://docs.python.org/3/library/collections.abc.html
- The Little Book of Python Anti-Patterns: https://docs.quantifiedcode.com/python-anti-patterns/
