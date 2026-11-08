# Message Chains (Train Wreck)

> **ID:** CS025 · **Category:** Couplers · **Sources:** Fowler 1999; Clean Code G36; Law of Demeter
>
> Chains such as a.getB().getC().getD() that couple the client to the whole navigation structure.

## Definition

A **message chain** (also known as a *train wreck*) is a sequence of calls in which the client asks one
object for another, asks that one for another, and so on:
`order.getCustomer().getAddress().getCity().getName()`. The client becomes coupled to the entire
navigation structure.

It is the most visible violation of the **Law of Demeter** ("only talk to your immediate friends"),
which *Clean Code* captures in G36 (avoid transitive navigation).

## Symptoms

- Expressions with three or more hops `a.b().c().d()` on domain objects.
- Temporary variables that walk the navigation step by step.
- Null checks at every link (`a and a.b and a.b.c`).
- The same chain repeated in several clients.

## Common causes

- Objects that expose their internal structure through getters.
- An "ask and decide" style instead of "tell it what to do" (*Tell, Don't Ask*).
- Models generated from the data schema.

## Why it is a problem

- Any change to the intermediate structure breaks every client.
- Clients know details that are none of their business.
- Code that is fragile in the face of intermediate null values.

## Example (smelly)

```csharp
public decimal ShippingCost(Order order)
{
    // SMELL: the client navigates the whole structure
    var country = order.Customer.Address.Country.IsoCode;
    return country == "ES" ? 4.95m : 14.95m;
}
```

## Solution (refactored)

```csharp
public class Order
{
    private readonly Customer _customer;
    public Order(Customer customer) => _customer = customer;

    // REFACTOR: Hide Delegate — the order answers for itself
    public bool ShipsDomestically => _customer.LivesIn("ES");
}

public decimal ShippingCost(Order order) =>
    order.ShipsDomestically ? 4.95m : 14.95m;
```

## Recommended refactorings

- **Hide Delegate**: the first object directly offers what the client needs.
- **Extract Function**: and **Move Function**: move what the client does with the end of the chain inward.

## When it may be acceptable

- Fluent interfaces and builders (`query.Where(...).OrderBy(...).Take(10)`): each call returns the same type or one at the same level of abstraction, without exposing structure.
- Navigation over pure data structures (DTOs, JSON, configuration), where the structure **is** the interface.
- Collection pipelines (`map/filter/reduce`, LINQ).

## Related smells

- [Middle Man](middle-man.md) — taken to the extreme, the cure produces middle men.
- [Feature Envy](feature-envy.md) — the client walking the chain usually envies the last object.
- [Inappropriate Intimacy](inappropriate-intimacy.md) — knowing the internal structure of other objects.
- [Null Check / Null Abuse](../06-data/null-abuse.md) — long chains force null checks at every step.

## Automatic detection

| Language | Tools and rules |
|---|---|
| Python | No standard rule in Pylint or Ruff; review chained access of three or more levels on domain objects. |
| C# | No standard Roslyn rule; NDepend and third-party analyzers include Law of Demeter checks. |
| React + TS | No standard rule; `@typescript-eslint/prefer-optional-chain` makes chains with null checks evident. |
| Go | No specific linter; review chained selectors on domain structs. |

Telling a problematic chain apart from a fluent interface requires understanding the types, so detection is usually manual.

## Implementations

Each folder contains the `smelly` version, the `refactored` version and the tests showing that both have the same observable behavior.

| Language | Folder |
|---|---|
| Python | [`python/code_smells/couplers/message_chains/`](../../../python/code_smells/couplers/message_chains/) |
| C# | [`csharp/src/CodeSmells/Couplers/MessageChains/`](../../../csharp/src/CodeSmells/Couplers/MessageChains/) |
| React + TS | [`react-ts/src/smells/couplers/message-chains/`](../../../react-ts/src/smells/couplers/message-chains/) |
| Go | [`go/smells/couplers/message-chains/`](../../../go/smells/couplers/message-chains/) |

## References

- Fowler, M. (1999). *Refactoring: Improving the Design of Existing Code*. Addison-Wesley (chapter 3, "Bad Smells in Code", written with Kent Beck).
- Fowler, M. (2018). *Refactoring: Improving the Design of Existing Code* (2nd ed.). Addison-Wesley. Refactoring catalog: https://refactoring.com/catalog/
- Martin, R. C. (2008). *Clean Code: A Handbook of Agile Software Craftsmanship*. Prentice Hall (chapter 17, "Smells and Heuristics").
- Mäntylä, M. V. and Lassenius, C. (2006). "Subjective evaluation of software evolvability using code smells: An empirical study". *Empirical Software Engineering*, 11(3), 395-431.
- Jerzyk, M. and Madeyski, L. (2023). *Code Smells: A Comprehensive Online Catalog and Taxonomy*. Online catalog: https://codesmells.org
- Fowler, M. — *TellDontAsk* (bliki): https://martinfowler.com/bliki/TellDontAsk.html
- Lieberherr, K. and Holland, I. (1989). "Assuring Good Style for Object-Oriented Programs". *IEEE Software*, 6(5) (Law of Demeter).
- Refactoring.Guru — Message Chains: https://refactoring.guru/smells/message-chains
- Refactoring.Guru — Code Smells: https://refactoring.guru/refactoring/smells
- Fowler, M. — *CodeSmell* (bliki): https://martinfowler.com/bliki/CodeSmell.html
