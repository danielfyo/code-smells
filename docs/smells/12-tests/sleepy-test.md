# Sleepy Test

> **ID:** CS088 · **Category:** Test Smells · **Sources:** Peruma 2019

*Using sleep to wait for asynchronous work: slow, nondeterministic tests.*

## Definition

The test uses explicit waits (`sleep`, `Thread.Sleep`, `setTimeout`, `time.Sleep`) to "give time" for an
asynchronous operation to finish. Cataloged by Peruma et al. (2019) in their test smell study, it produces
slow and nondeterministic tests: if the wait is short they fail intermittently; if it is long, they waste
time on every run.

## Symptoms

- `time.sleep(1)`, `await Task.Delay(500)`, `await new Promise(r => setTimeout(r, 300))`, `time.Sleep(...)` in tests.
- Tests that occasionally fail in CI (flaky) and pass when rerun.
- Wait values tuned by hand "until it works".

## Common causes

- Asynchronous code with no mechanism to know when it has finished.
- Dependence on the real clock in production code.
- Unfamiliarity with fake clocks and conditional-wait utilities.

## Why it is a problem

- **Flakiness**: intermittent failures that erode trust in the suite.
- **Accumulated slowness**.
- Tests that end up ignored because they are unstable.

## Example (smelly)

```go
func TestNotifierSendsReminder(t *testing.T) {
    sender := &fakeSender{}
    n := NewNotifier(sender, 50*time.Millisecond)
    n.Start()
    // SMELL: real wait; slow and nondeterministic
    time.Sleep(200 * time.Millisecond)
    if len(sender.Sent()) != 1 {
        t.Fatalf("expected 1 reminder, got %d", len(sender.Sent()))
    }
}
```

## Solution (refactored)

```go
func TestNotifierSendsReminder(t *testing.T) {
    sender := &fakeSender{sent: make(chan Reminder, 1)}
    n := NewNotifier(sender, 50*time.Millisecond)
    n.Start()
    defer n.Stop()
    // REFACTOR: explicit synchronization with a channel and a deadline
    select {
    case <-sender.sent:
    case <-time.After(time.Second):
        t.Fatal("reminder was not sent")
    }
}
```

Other options: inject a fake clock (`freezegun`/`time-machine` in Python, `TimeProvider` and
`FakeTimeProvider` in .NET 8, `vi.useFakeTimers()` in Vitest), or wait for a condition (Testing Library's
`waitFor`) instead of a fixed time.

## Recommended refactorings

- **Explicit synchronization**: channels, returned tasks/promises, events or completion callbacks.
- **Fake clocks** injected instead of the real clock (the *Test Double* pattern applied to time).
- **Conditional waits** with a deadline (`waitFor`, testify's `Eventually`) instead of fixed waits.
- **Humble Object**: separate the timed logic from the scheduler so it can be tested synchronously.

## When it may be acceptable

- Integration tests against external systems without completion notification, using polling with a deadline (not a fixed `sleep`).
- Deliberate demonstrations, as in this repository, with very short waits (< 300 ms).

## Related smells

- [Slow Tests](slow-tests.md): waits are a direct cause of slowness.
- [Ignored Tests](ignored-tests.md): flaky tests end up disabled.
- [DateTime.Now Hidden Dependency](../15-csharp/datetime-now-dependency.md): depending on the real clock in C#.
- [time.After in Loops](../17-go/time-after-in-loop.md): problematic use of timers in Go.
- [Interdependent Tests / Shared Fixture](interdependent-tests.md): another source of flakiness.

## Automatic detection

- **Direct search**: `sleep(`, `Thread.Sleep`, `Task.Delay`, `setTimeout` or `time.Sleep` in test files; easy to add as a CI check.
- **TypeScript**: ESLint `no-restricted-syntax`/`no-restricted-globals` to ban `setTimeout` in tests; `testing-library/prefer-find-by` suggests conditional waits.
- **Python**: Ruff `TID251` (banned-api) to forbid `time.sleep` in the tests directory.
- **C#**: `BannedApiAnalyzers` to forbid `Thread.Sleep` in test projects.
- **Go**: `forbidigo` in golangci-lint to forbid `time.Sleep` in `_test.go` files.
- **Research**: tsDetect (testsmells.org) detects *Sleepy Test* in Java.

## Implementations

- Python: [`python/code_smells/tests/sleepy_test/`](../../../python/code_smells/tests/sleepy_test/)
- C#: [`csharp/src/CodeSmells/Tests/SleepyTest/`](../../../csharp/src/CodeSmells/Tests/SleepyTest/)
- React + TS: [`react-ts/src/smells/tests/sleepy-test/`](../../../react-ts/src/smells/tests/sleepy-test/)
- Go: [`go/smells/tests/sleepy-test/`](../../../go/smells/tests/sleepy-test/)
- Angular: [`angular/src/smells/tests/sleepy-test/`](../../../angular/src/smells/tests/sleepy-test/)

Each folder contains the production code under test and two versions of the tests: the `smelly` one, showing
the smell (marked with `SMELL:` comments), and the `refactored` one, with the clean test (`REFACTOR:`
comments). Both versions pass; the difference lies in readability, speed or reliability.

## References

- Peruma, A. et al. (2019). "On the Distribution of Test Smells in Open Source Android Applications: An Exploratory Study". *CASCON 2019*.
- Test smells catalog (tsDetect and related research): https://testsmells.org
- Meszaros, G. (2007). *xUnit Test Patterns: Refactoring Test Code*. Addison-Wesley.
