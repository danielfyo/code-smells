# Java-style Getters and Setters

> **ID:** CS098 · **Category:** Python-specific · **Sources:** Little Book of Python Anti-Patterns

## Definition

A Python class exposes its data through `get_x()` / `set_x(value)` methods that merely read or write a "private"
attribute (`self._x`). The pattern is imported from Java or C++, where changing a public field into a method breaks
the API. Python does not need it: a public attribute can later become a `@property` without changing how callers
use it.

## Symptoms

- Pairs of trivial `get_price` / `set_price` methods with no logic.
- Verbose calls such as `order.set_total(order.get_total() + line.get_amount())`.
- Underscore attributes whose only access path is those methods.
- Data-holder classes with more accessors than behaviour.

## Common causes

- A Java/C# background and a literal application of "always encapsulate".
- Code generators or IDE templates.
- Fear of having to change the API if validation is added in the future.

## Why it is a problem

- **Noise**: doubles the number of lines without adding behaviour.
- **Unidiomatic API**: Python users expect `order.total`, not `order.get_total()`.
- **False encapsulation**: if the setter accepts any value, the invariant is not protected.
- Makes the class awkward to use with tools that expect attributes (serialization, `dataclasses`, `attrs`).

## How it works under the hood

`property` is a **descriptor**: a class-level object defining `__get__`, `__set__` and `__delete__`. When
`obj.total` is accessed, attribute lookup finds the descriptor on the class and calls its `__get__`, which runs the
decorated method. That is why you can start with a plain attribute and, if validation or a computed value is needed
later, replace it with `@property` without changing client code. Python has no access modifiers; a leading
underscore is a convention meaning "internal use".

## Example (smelly)

```python
class Product:
    def __init__(self, name: str, price: float) -> None:
        self._name = name
        self._price = price

    # SMELL: trivial accessors that add nothing
    def get_name(self) -> str:
        return self._name

    def set_name(self, name: str) -> None:
        self._name = name

    def get_price(self) -> float:
        return self._price

    def set_price(self, price: float) -> None:
        self._price = price  # does not even validate
```

## Solution (refactored)

```python
class Product:
    def __init__(self, name: str, price: float) -> None:
        self.name = name          # REFACTOR: plain public attribute
        self.price = price        # goes through the property setter

    @property
    def price(self) -> float:
        return self._price

    @price.setter
    def price(self, value: float) -> None:
        # REFACTOR: a property only where there is an invariant to protect
        if value < 0:
            raise ValueError("Price cannot be negative")
        self._price = value
```

If the class only groups data, `@dataclass` (with `frozen=True` if it must be immutable) is even more direct.

## Recommended refactorings

- **Replace Accessor with Attribute**: remove trivial getters/setters and use public attributes.
- **Encapsulate Field with `@property`** only where there is validation, computation or lazy loading.
- **Introduce `dataclass` / `NamedTuple`** for classes that are data containers.
- If the setter should not exist, expose only a read-only property or make the object immutable.

## When it may be acceptable

- Expensive operations or ones with side effects (network calls, heavy recalculation): a `fetch_rate()` or
  `calculate_total()` method communicates better than a property that "looks like" a cheap attribute.
- Methods taking extra parameters (`get_price(currency="EUR")`).
- Compatibility with an existing API or with frameworks that expect those names.

## Related smells

- [Data Class](../04-dispensables/data-class.md)
- [Clutter](../04-dispensables/clutter.md)
- [Getters with Get Prefix (Go)](../17-go/get-prefix-getters.md)
- [Anemic Domain Model (C#)](../15-csharp/anemic-domain-model.md)

## Automatic detection

There is no standard Pylint or Ruff rule that flags trivial getters/setters. They are found in code review or with
custom rules (for example, a Pylint plugin or a Semgrep query that looks for `get_*`/`set_*` methods whose body is a
single `return self._x` or `self._x = value`).

## Implementations

- Python: [`python/code_smells/python_specific/java_style_getters_setters/`](../../../python/code_smells/python_specific/java_style_getters_setters/)

Python-specific smell: there is no implementation in the other languages of the repository.

## References

- Python docs, `property`: https://docs.python.org/3/library/functions.html#property
- Python docs, *Descriptor HowTo Guide*: https://docs.python.org/3/howto/descriptor.html
- Python docs, `dataclasses`: https://docs.python.org/3/library/dataclasses.html
- The Little Book of Python Anti-Patterns: https://docs.quantifiedcode.com/python-anti-patterns/
