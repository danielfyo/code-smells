# Slow Tests

> **ID:** CS083 · **Category:** Test Smells · **Sources:** Clean Code T9; Meszaros 2007

*Tests that depend on the network, disk or real waits and take so long nobody runs them.*

## Definition

Tests that take so long to run that developers stop running them often: they depend on the network, a real
database, disk, real waits, or on spinning up the whole system for each case. *Clean Code* (T9, *Tests
Should Be Fast*) and Meszaros (*Slow Tests*) agree: a slow test is a test that does not get run.

## Symptoms

- The unit suite takes minutes instead of seconds.
- Real HTTP calls, database connections or large file reads in unit tests.
- `sleep`/`Thread.Sleep`/`setTimeout` in tests.
- Developers running only "the test I'm working on" and leaving the rest to CI.
- Heavy setup (a general fixture) repeated for every test.

## Common causes

- Code coupled to infrastructure that does not allow dependencies to be replaced.
- Using integration tests for everything.
- General fixtures that prepare much more than each test needs.

## Why it is a problem

- **Late feedback**: errors are discovered hours later.
- **They run less often**, which reduces their value.
- Expensive, slow CI pipelines that hold back continuous integration.

## Example (smelly)

```python
def test_order_confirmation_email():
    # SMELL: real SMTP and a real wait
    service = OrderService(mailer=SmtpMailer("smtp.internal.example"))
    service.confirm(order_id=42)
    time.sleep(2)  # "wait for it to arrive"
    assert mailbox_contains("customer@shop.example", "Order 42 confirmed")
```

## Solution (refactored)

```python
class FakeMailer:
    def __init__(self):
        self.sent: list[Email] = []

    def send(self, email: Email) -> None:
        self.sent.append(email)


def test_order_confirmation_email():
    # REFACTOR: in-memory Fake Object; no network, no waits
    mailer = FakeMailer()
    OrderService(mailer=mailer).confirm(order_id=42)
    assert mailer.sent[0].subject == "Order 42 confirmed"
```

## Recommended refactorings

- **Test Doubles** (*Fake Object*, *Stub*, *Mock*) to replace network, disk and databases.
- **Humble Object** to isolate logic from infrastructure.
- **Immutable Shared Fixture** or minimal fixtures instead of preparing the whole world (Meszaros).
- Replace waits with **fake clocks** or explicit synchronization (see *Sleepy Test*).
- Split suites: fast unit tests on every change, integration tests in CI.

## When it may be acceptable

- Integration and end-to-end tests, which are slow by nature; they should be fewer and run in a separate suite.
- Performance or load tests.

## Related smells

- [Sleepy Test](sleepy-test.md): waits are a direct cause of slowness.
- [Mystery Guest](mystery-guest.md): external resources that also slow things down.
- [Tests Require More Than One Step](../13-environment/multi-step-tests.md): if running tests is slow and also complicated, nobody runs them.
- [Interdependent Tests / Shared Fixture](interdependent-tests.md): fixtures shared for speed can create dependencies.

## Automatic detection

- **Python**: `pytest --durations=10` shows the slowest tests; `pytest-timeout` enforces limits.
- **C#**: `dotnet test` reports (TRX) include durations; `--blame-hang-timeout` detects hanging tests.
- **TypeScript**: Vitest and Jest flag slow tests (the `slowTestThreshold` option).
- **Go**: `go test -v` shows per-test duration; `-timeout` limits execution.
- **Research**: tsDetect (see testsmells.org) detects *Sleepy Test* in Java.

## Implementations

- Python: [`python/code_smells/tests/slow_tests/`](../../../python/code_smells/tests/slow_tests/)
- C#: [`csharp/src/CodeSmells/Tests/SlowTests/`](../../../csharp/src/CodeSmells/Tests/SlowTests/)
- React + TS: [`react-ts/src/smells/tests/slow-tests/`](../../../react-ts/src/smells/tests/slow-tests/)
- Go: [`go/smells/tests/slow-tests/`](../../../go/smells/tests/slow-tests/)
- Angular: [`angular/src/smells/tests/slow-tests/`](../../../angular/src/smells/tests/slow-tests/)

Each folder contains the production code under test and two versions of the tests: the `smelly` one, showing
the smell (marked with `SMELL:` comments), and the `refactored` one, with the clean test (`REFACTOR:`
comments). Both versions pass; the difference lies in readability, speed or reliability.

## References

- Martin, R. C. (2008). *Clean Code*, ch. 17 "Smells and Heuristics". Prentice Hall.
- Martin, R. C. (2008). *Clean Code*, ch. 9 "Unit Tests". Prentice Hall.
- Meszaros, G. (2007). *xUnit Test Patterns: Refactoring Test Code*. Addison-Wesley.
- Test smells catalog (tsDetect and related research): https://testsmells.org
