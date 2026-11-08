# Mystery Guest

> **ID:** CS085 · **Category:** Test Smells · **Sources:** van Deursen 2001; Meszaros 2007

*The test depends on external resources (files, databases) that are invisible when reading it.*

## Definition

The test uses external resources (files, database rows, environment variables, services) whose content is
not visible when reading the test. To understand what is being tested and why the result is the expected
one, you have to go and find those resources. Described by van Deursen et al. (2001) and by Meszaros as a
cause of *Obscure Test*.

## Symptoms

- Reads of `fixtures/customers.json`, `testdata/order_7.xml` or rows "seeded" in the test database.
- Magic expected values that depend on the resource's content (`assert total == 1234.56`).
- Tests that fail when a data file shared by many tests changes.
- Tests that only pass on the machine of whoever wrote them.

## Common causes

- Reusing large sample data to avoid writing it in each test.
- Integration tests disguised as unit tests.

## Why it is a problem

- **Obscure tests**: the cause-and-effect relationship is not visible.
- **Fragility**: shared resources change and break unrelated tests.
- Environment dependence and, often, slowness.

## Example (smelly)

```python
def test_vip_customer_gets_discount():
    # SMELL: what is in that file? why 85?
    customer = load_customer("tests/data/customer_17.json")
    assert price_for(customer, Decimal("100")) == Decimal("85")
```

## Solution (refactored)

```python
def test_vip_customer_gets_discount():
    # REFACTOR: Inline Resource; the relevant data is in plain sight
    customer = Customer(id=17, tier="vip", years_active=6)
    # 10% for VIP + 5% for more than 5 years as a customer
    assert price_for(customer, Decimal("100")) == Decimal("85")
```

## Recommended refactorings

- **Inline Resource** (van Deursen et al.): create the data inside the test itself.
- **Setup External Resource** when the file is essential, generating it in the test with the relevant content visible.
- **Creation Method** (Meszaros) or test data builders that show only what is relevant.
- **Fresh Fixture** instead of a shared database.

## When it may be acceptable

- Integration tests for parsers or importers where the sample file *is* the case (e.g. a real XML from a supplier), with a descriptive name and kept next to the test.
- Well-managed golden files / snapshot testing, with the files reviewed under version control.

## Related smells

- [Slow Tests](slow-tests.md): external resources slow things down.
- [Interdependent Tests / Shared Fixture](interdependent-tests.md): resources shared between tests.
- [Fragile Test / Testing Implementation Details](fragile-test.md): changes to data break tests.
- [Logical Dependency Not Made Physical](../11-general/hidden-logical-dependency.md): the test depends on something it does not declare.

## Automatic detection

- There are no standard linter rules in Python, C#, TypeScript or Go; it is caught in review by looking for file reads, environment variables or connections in tests.
- **Research**: tsDetect (testsmells.org) detects *Mystery Guest* in Java tests.
- Running tests in isolation (clean containers in CI) reveals dependencies on environment resources.

## Implementations

- Python: [`python/code_smells/tests/mystery_guest/`](../../../python/code_smells/tests/mystery_guest/)
- C#: [`csharp/src/CodeSmells/Tests/MysteryGuest/`](../../../csharp/src/CodeSmells/Tests/MysteryGuest/)
- React + TS: [`react-ts/src/smells/tests/mystery-guest/`](../../../react-ts/src/smells/tests/mystery-guest/)
- Go: [`go/smells/tests/mystery-guest/`](../../../go/smells/tests/mystery-guest/)
- Angular: [`angular/src/smells/tests/mystery-guest/`](../../../angular/src/smells/tests/mystery-guest/)

Each folder contains the production code under test and two versions of the tests: the `smelly` one, showing
the smell (marked with `SMELL:` comments), and the `refactored` one, with the clean test (`REFACTOR:`
comments). Both versions pass; the difference lies in readability, speed or reliability.

## References

- van Deursen, A., Moonen, L., van den Bergh, A. and Kok, G. (2001). "Refactoring Test Code". *Proceedings of the 2nd International Conference on Extreme Programming and Flexible Processes (XP2001)*.
- Meszaros, G. (2007). *xUnit Test Patterns: Refactoring Test Code*. Addison-Wesley.
- Test smells catalog (tsDetect and related research): https://testsmells.org
