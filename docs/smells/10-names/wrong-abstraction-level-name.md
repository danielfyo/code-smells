# Names at Wrong Abstraction Level

> **ID:** CS057 · **Category:** Names · **Sources:** Clean Code N2

*Names that reveal the implementation (dialModem) rather than the concept (connect).*

## Definition

The name of a function, class or interface reveals **how** it is implemented instead of **what** it
represents: `dialModem()` on a connection interface, `saveToMySql()` on a repository, `ArrayListOfOrders`.
*Clean Code* (N2, *Choose Names at the Appropriate Level of Abstraction*) notes that such names tie the
abstraction to a concrete detail and become false when the implementation changes.

## Symptoms

- Interface or abstract class methods that mention technologies: `sendSmtpEmail`, `writeToRedis`, `fetchFromRest`.
- Names that include the data structure used (`userHashMap`, `ordersArray`).
- Alternative implementations forced to inherit names that do not fit them (a `FileStorage` with an `uploadToS3` method).
- Domain layers that speak the language of infrastructure.

## Common causes

- The abstraction was extracted from a first concrete implementation without renaming.
- Thinking in terms of the technical solution rather than the domain.

## Why it is a problem

- **Names that lie** once a second implementation appears.
- **Conceptual coupling**: clients assume details they should not know about.
- Harder to swap implementations (test doubles, infrastructure migrations).

## Example (smelly)

```csharp
public interface INotificationSender
{
    // SMELL: the abstraction talks about SMTP even though there are SMS or push implementations
    void SendSmtpEmail(string address, string body);
}

public class SmsSender : INotificationSender
{
    public void SendSmtpEmail(string address, string body) => _gateway.SendSms(address, body);
}
```

## Solution (refactored)

```csharp
public interface INotificationSender
{
    // REFACTOR: name at the abstraction's level (the concept, not the mechanism)
    void Notify(Recipient recipient, string message);
}

public class SmsSender : INotificationSender
{
    public void Notify(Recipient recipient, string message) => _gateway.SendSms(recipient.Phone, message);
}
```

## Recommended refactorings

- **Change Function Declaration** to raise the name to the level of the concept.
- **Rename Field / Rename Variable** when the name includes the data structure.
- **Extract Superclass** (or an interface) with domain names if the abstraction does not exist yet.

## When it may be acceptable

- In the concrete implementation itself, where the detail is exactly what matters (`SmtpEmailSender`, `PostgresOrderRepository`).
- Low-level utilities whose purpose *is* the technology (a Redis client).

## Related smells

- [Encodings in Names / Type Embedded in Name](encodings-in-names.md): another name that describes the "how".
- [Mysterious / Uncommunicative Name](uncommunicative-name.md): the name does not communicate the concept.
- [Mixed Levels of Abstraction](../07-functions/mixed-abstraction-levels.md): the same level mismatch inside a function.
- [Fallacious Method Name](fallacious-method-name.md): the name ends up promising something that does not happen.

## Automatic detection

- There are no general automatic rules; it is caught in code review and when adding a second implementation.
- **C#**: `CA1720` flags identifiers containing type names (`int`, `string`...), a particular case.
- **Searches** for infrastructure terms (`Sql`, `Http`, `Redis`, `S3`, `Smtp`) in interfaces and domain layers, or architecture rules (ArchUnitNET, dependency-cruiser, `depguard` in Go) that prevent the domain from depending on infrastructure.

## Implementations

- Python: [`python/code_smells/names/wrong_abstraction_level_name/`](../../../python/code_smells/names/wrong_abstraction_level_name/)
- C#: [`csharp/src/CodeSmells/Names/WrongAbstractionLevelName/`](../../../csharp/src/CodeSmells/Names/WrongAbstractionLevelName/)
- React + TS: [`react-ts/src/smells/names/wrong-abstraction-level-name/`](../../../react-ts/src/smells/names/wrong-abstraction-level-name/)
- Go: [`go/smells/names/wrong-abstraction-level-name/`](../../../go/smells/names/wrong-abstraction-level-name/)

Each folder contains a `smelly` version (the smell, marked with `SMELL:` comments) and a `refactored` version (marked with `REFACTOR:` comments), plus tests showing that both have the same observable behavior.

## References

- Martin, R. C. (2008). *Clean Code*, ch. 17 "Smells and Heuristics". Prentice Hall.
- Martin, R. C. (2008). *Clean Code*, ch. 2 "Meaningful Names". Prentice Hall.
- Fowler, M. (2018). *Refactoring: Improving the Design of Existing Code* (2nd ed.). Addison-Wesley. Refactoring catalog: https://refactoring.com/catalog/
- Jerzyk, M. and Madeyski, L. (2023). "Code Smells: A Comprehensive Online Catalog and Taxonomy". Online catalog: https://codesmells.org
