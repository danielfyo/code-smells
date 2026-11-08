# Base Class Depending on Its Derivatives

> **ID:** CS010 · **Category:** Object-Orientation Abusers · **Sources:** Clean Code G7
>
> A base class knows about or references its subclasses, breaking the hierarchy and the open/closed principle.

## Definition

A **base class that depends on its derivatives** knows, names or checks its own subclasses: it calls
`isinstance(self, PremiumUser)`, imports their modules or contains a `switch` over them. *Clean Code*
(G7) puts it plainly: base classes should know nothing about their derivatives.

Dependencies should always point from the concrete to the abstract. When the base points downward,
every new subclass forces a change to the base, and both become tied to the same deployment cycle.

## Symptoms

- `isinstance`, `is`, `instanceof` or type switches inside the base class on its subclasses.
- The base class imports the modules of its derivatives (circular dependencies).
- Base methods with branches specific to certain subclasses.
- Static factories in the base that enumerate all the subclasses.

## Common causes

- Adding a "quick" special case in the base instead of overriding a method.
- Not knowing the *Template Method* pattern or hooks.
- Mixing object creation with behavior in the base.

## Why it is a problem

- It violates the open/closed and dependency inversion principles.
- Import cycles and coupling between modules.
- Subclasses cannot be added from other packages without modifying the base.

## Example (smelly)

```python
class Notification:
    def send(self, text: str) -> str:
        # SMELL: the base knows its derivatives
        if isinstance(self, SmsNotification):
            text = text[:160]
        elif isinstance(self, PushNotification):
            text = f"[App] {text}"
        return self.deliver(text)

class SmsNotification(Notification):
    def deliver(self, text): return f"SMS: {text}"

class PushNotification(Notification):
    def deliver(self, text): return f"PUSH: {text}"
```

## Solution (refactored)

```python
class Notification:
    def send(self, text: str) -> str:
        return self.deliver(self.format(text))

    def format(self, text: str) -> str:  # hook with default behavior
        return text

class SmsNotification(Notification):
    def format(self, text): return text[:160]
    def deliver(self, text): return f"SMS: {text}"

class PushNotification(Notification):
    def format(self, text): return f"[App] {text}"
    def deliver(self, text): return f"PUSH: {text}"
```

The base defines the algorithm (*Template Method*) and offers a hook; each subclass supplies its variation without the base knowing about it.

## Recommended refactorings

- **Replace Conditional with Polymorphism**: each specific branch moves to an overridden method in its subclass.
- **Form Template Method**: the base defines the steps and the subclasses fill them in.
- **Push Down Method**: moves behavior that belongs only to one subclass down into it.
- **Replace Constructor with Factory Function**: moves the choice of subclass to a factory outside the hierarchy.

## When it may be acceptable

- Closed, sealed hierarchies where the set of subclasses is fixed and the compiler checks exhaustiveness.
- Discriminated unions in TypeScript or sealed records in C#, which are explicitly an enumeration of cases.

## Related smells

- [Switch Statements / Repeated Switches](switch-statements.md) — the base usually decides with a `switch` on the concrete type.
- [Refused Bequest](refused-bequest.md) — another form of poorly factored hierarchy.
- [Inappropriate Intimacy](../05-couplers/inappropriate-intimacy.md) — two-way coupling between base and derivatives.
- [Type Checking with type()](../14-python/type-checking-with-type.md) — Python variant with `type(self) is ...`.

## Automatic detection

| Language | Tools and rules |
|---|---|
| Python | Pylint `R0401 cyclic-import` (base-derivative import cycles); `C0123 unidiomatic-typecheck` for `type(x) == ...`. |
| C# | NDepend and architecture analyzers (e.g. ArchUnitNET) can forbid a type from depending on its derivatives; review `is`/`switch` on types in base classes. |
| React + TS | `import/no-cycle` (eslint-plugin-import) detects the import cycles that usually come with it. |
| Go | Go has no inheritance; the equivalent is a type that does a type switch on the types embedding it. The compiler forbids cycles between packages. |

## Implementations

Each folder contains the `smelly` version, the `refactored` version and the tests showing that both have the same observable behavior.

| Language | Folder |
|---|---|
| Python | [`python/code_smells/oo_abusers/base_class_depends_on_subclass/`](../../../python/code_smells/oo_abusers/base_class_depends_on_subclass/) |
| C# | [`csharp/src/CodeSmells/OoAbusers/BaseClassDependsOnSubclass/`](../../../csharp/src/CodeSmells/OoAbusers/BaseClassDependsOnSubclass/) |
| React + TS | [`react-ts/src/smells/oo_abusers/base-class-depends-on-subclass/`](../../../react-ts/src/smells/oo_abusers/base-class-depends-on-subclass/) |
| Go | [`go/smells/oo_abusers/base-class-depends-on-subclass/`](../../../go/smells/oo_abusers/base-class-depends-on-subclass/) |

## References

- Martin, R. C. (2008). *Clean Code: A Handbook of Agile Software Craftsmanship*. Prentice Hall (chapter 17, "Smells and Heuristics").
- Jerzyk, M. and Madeyski, L. (2023). *Code Smells: A Comprehensive Online Catalog and Taxonomy*. Online catalog: https://codesmells.org
- Fowler, M. — *CodeSmell* (bliki): https://martinfowler.com/bliki/CodeSmell.html
