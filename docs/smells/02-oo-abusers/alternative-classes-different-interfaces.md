# Alternative Classes with Different Interfaces

> **ID:** CS009 · **Category:** Object-Orientation Abusers · **Sources:** Fowler 1999
>
> Two classes do the same thing but with different names and signatures, which prevents swapping them.

## Definition

**Alternative classes with different interfaces** are two or more classes that do essentially the same
thing but expose methods with different names, signatures or parameter order. Because they do not share
an interface, client code cannot swap them and ends up writing specific branches for each one.

It is common when two teams (or the same team at two different times) integrate equivalent providers
(two payment gateways, two SMS services) without agreeing on a common contract.

## Symptoms

- Equivalent methods with different names: `send_email(to, body)` versus `deliver(message)`.
- `if provider == "a": a.charge(...) else: b.make_payment(...)` in clients.
- Scattered ad hoc adapters that translate between both classes.
- Duplicated logic around each implementation.

## Common causes

- Parallel development without an agreed interface.
- Integrating third-party SDKs directly without an abstraction layer.
- Not knowing that an equivalent class already existed.

## Why it is a problem

- It is impossible to replace one implementation with another (or with a test double) without touching the clients.
- Duplicated client code and tests.
- Adding a third provider multiplies the branches.

## Example (smelly)

```go
type SmtpMailer struct{}

func (SmtpMailer) SendEmail(to, subject, body string) error { return nil }

type ApiMailer struct{}

func (ApiMailer) Deliver(msg Message) (bool, error) { return true, nil }

func NotifyCustomer(useAPI bool, to string) error {
	if useAPI {
		_, err := ApiMailer{}.Deliver(Message{To: to, Subject: "Order", Body: "..."})
		return err
	}
	return SmtpMailer{}.SendEmail(to, "Order", "...")
}
```

## Solution (refactored)

```go
type Mailer interface {
	Send(msg Message) error
}

type SmtpMailer struct{}

func (SmtpMailer) Send(msg Message) error { return nil }

type ApiMailer struct{}

func (ApiMailer) Send(msg Message) error { return nil }

func NotifyCustomer(m Mailer, to string) error {
	return m.Send(Message{To: to, Subject: "Order", Body: "..."})
}
```

## Recommended refactorings

- **Change Function Declaration**: renames and aligns signatures until they match (formerly *Rename Method* / *Add Parameter*).
- **Move Function**: redistributes behavior so both classes have the same responsibilities.
- **Extract Superclass**: or extract a common interface, if they share behavior.
- **Unify Interfaces with Adapter**: from Kerievsky, when one of the classes is third-party and cannot be modified.

## When it may be acceptable

- The classes are only superficially similar and will evolve in different directions.
- They are used in contexts that never need to swap them.

## Related smells

- [Duplicate Code](../04-dispensables/duplicate-code.md) — client code is duplicated for each variant.
- [Switch Statements / Repeated Switches](switch-statements.md) — clients choose the implementation with conditionals.
- [Incomplete Library Class](../05-couplers/incomplete-library-class.md) — one of the classes is often a third-party library.
- [Inconsistent Names](../10-names/inconsistent-names.md) — different names for the same operation.

## Automatic detection

| Language | Tools and rules |
|---|---|
| Python | No specific rule; `typing.Protocol` with mypy/pyright lets you check that both classes satisfy the same interface. |
| C# | No specific rule; extract an interface and let the compiler flag the classes that do not satisfy it. |
| React + TS | No specific rule; define a common `interface` and type the clients against it. |
| Go | No specific rule; the compile-time assertion `var _ Mailer = ApiMailer{}` documents and verifies conformance. |

This is a semantic smell: it is caught by code review and semantic clone detection tools, not by the usual linters.

## Implementations

Each folder contains the `smelly` version, the `refactored` version and the tests showing that both have the same observable behavior.

| Language | Folder |
|---|---|
| Python | [`python/code_smells/oo_abusers/alternative_classes_different_interfaces/`](../../../python/code_smells/oo_abusers/alternative_classes_different_interfaces/) |
| C# | [`csharp/src/CodeSmells/OoAbusers/AlternativeClassesDifferentInterfaces/`](../../../csharp/src/CodeSmells/OoAbusers/AlternativeClassesDifferentInterfaces/) |
| React + TS | [`react-ts/src/smells/oo_abusers/alternative-classes-different-interfaces/`](../../../react-ts/src/smells/oo_abusers/alternative-classes-different-interfaces/) |
| Go | [`go/smells/oo_abusers/alternative-classes-different-interfaces/`](../../../go/smells/oo_abusers/alternative-classes-different-interfaces/) |
| Angular | [`angular/src/smells/oo_abusers/alternative-classes-different-interfaces/`](../../../angular/src/smells/oo_abusers/alternative-classes-different-interfaces/) |

## References

- Fowler, M. (1999). *Refactoring: Improving the Design of Existing Code*. Addison-Wesley (chapter 3, "Bad Smells in Code", written with Kent Beck).
- Fowler, M. (2018). *Refactoring: Improving the Design of Existing Code* (2nd ed.). Addison-Wesley. Refactoring catalog: https://refactoring.com/catalog/
- Mäntylä, M. V. and Lassenius, C. (2006). "Subjective evaluation of software evolvability using code smells: An empirical study". *Empirical Software Engineering*, 11(3), 395-431.
- Jerzyk, M. and Madeyski, L. (2023). *Code Smells: A Comprehensive Online Catalog and Taxonomy*. Online catalog: https://codesmells.org
- Kerievsky, J. (2004). *Refactoring to Patterns*. Addison-Wesley.
- Refactoring.Guru — Alternative Classes with Different Interfaces: https://refactoring.guru/smells/alternative-classes-with-different-interfaces
- Refactoring.Guru — Code Smells: https://refactoring.guru/refactoring/smells
- Fowler, M. — *CodeSmell* (bliki): https://martinfowler.com/bliki/CodeSmell.html
