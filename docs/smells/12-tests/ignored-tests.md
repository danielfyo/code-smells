# Ignored Tests

> **ID:** CS081 · **Category:** Test Smells · **Sources:** Clean Code T4

*Tests disabled or skipped with no documented reason that nobody ever re-enables.*

## Definition

Disabled tests (`@skip`, `[Fact(Skip = ...)]`, `it.skip`, `t.Skip()`, `xit`) with no documented reason or
plan to re-enable them; they end up forgotten for months. *Clean Code* (T4, *An Ignored Test Is a Question
about an Ambiguity*) reads them as unanswered questions: an ignored test signals a doubt about the
requirements that someone needs to resolve.

## Symptoms

- `skip`/`Ignore`/`xfail` markers with no reason or vague ones ("flaky", "check later").
- Entire tests commented out.
- The suite report shows dozens of permanently skipped tests.
- Forgotten `it.only`/`fit` that prevent the rest of the suite from running.

## Common causes

- Flaky tests disabled instead of fixed.
- Requirement changes that left tests obsolete without deciding what to do with them.
- Pressure to keep the pipeline green.

## Why it is a problem

- **Unprotected functionality** that can break without anyone noticing.
- **Noise and distrust** in the suite: "there are so many skips we no longer know which ones matter".
- Questions about the requirements stay unanswered.

## Example (smelly)

```csharp
public class InvoiceTests
{
    [Fact(Skip = "broken, check")] // SMELL: ignored with no clear reason or date
    public void Credit_note_has_negative_total()
    {
        var invoice = Invoice.CreditNoteFor(_original);
        Assert.True(invoice.Total < 0);
    }
}
```

## Solution (refactored)

```csharp
public class InvoiceTests
{
    // REFACTOR: the ambiguity was resolved with the business and the test runs again
    [Fact]
    public void Credit_note_total_is_the_negated_original_total()
    {
        var invoice = Invoice.CreditNoteFor(_original);
        Assert.Equal(-_original.Total, invoice.Total);
    }
}
```

If a test must be disabled temporarily, document it with a link to the issue and, better still, use a
mechanism that fails when the test starts passing (`xfail(strict=True)` in pytest).

## Recommended refactorings

- **Fix or delete**: an ignored test must be re-enabled once the doubt is resolved, or deleted if it no longer represents a requirement.
- **Stabilize flaky tests** by attacking the cause (waits, shared state, external dependencies).
- Require a **reason and an issue link** on every `skip`, and review them periodically.
- Use `xfail(strict=True)` or equivalents to document known bugs in a verifiable way.

## When it may be acceptable

- Environment-dependent tests with an explicit reason (`skipif(sys.platform == "win32")`, integration tests that require an environment variable).
- Known bugs documented with strict `xfail` and an open issue.

## Related smells

- [Overridden Safeties](../08-error-handling/overridden-safeties.md): disabling tests is overriding a safety.
- [Commented-Out Code](../09-comments/commented-out-code.md): commented-out tests are commented-out code.
- [Insufficient Tests](insufficient-tests.md): ignored tests reduce effective coverage.
- [Sleepy Test](sleepy-test.md): a frequent cause of flakiness that leads to ignored tests.
- [Interdependent Tests / Shared Fixture](interdependent-tests.md): another common cause of intermittent tests.

## Automatic detection

- **Python**: `pytest -rs` lists skipped tests and their reasons; `xfail_strict = true` in the configuration; Ruff `PT` (flake8-pytest-style) for misused markers.
- **C#**: xUnit analyzer `xUnit1004` (*Test methods should not be skipped*); SonarQube `S1607` (ignored tests).
- **TypeScript**: `jest/no-disabled-tests` and `jest/no-focused-tests` (equivalents exist in `@vitest/eslint-plugin`).
- **Go**: no standard linter; `go test -v` shows `--- SKIP` and a search for `t.Skip` in CI works as a check.

## Implementations

- Python: [`python/code_smells/tests/ignored_tests/`](../../../python/code_smells/tests/ignored_tests/)
- C#: [`csharp/src/CodeSmells/Tests/IgnoredTests/`](../../../csharp/src/CodeSmells/Tests/IgnoredTests/)
- React + TS: [`react-ts/src/smells/tests/ignored-tests/`](../../../react-ts/src/smells/tests/ignored-tests/)
- Go: [`go/smells/tests/ignored-tests/`](../../../go/smells/tests/ignored-tests/)

Each folder contains the production code under test and two versions of the tests: the `smelly` one, showing
the smell (marked with `SMELL:` comments), and the `refactored` one, with the clean test (`REFACTOR:`
comments). Both versions pass; the difference lies in readability, speed or reliability.

## References

- Martin, R. C. (2008). *Clean Code*, ch. 17 "Smells and Heuristics". Prentice Hall.
- Meszaros, G. (2007). *xUnit Test Patterns: Refactoring Test Code*. Addison-Wesley.
- Test smells catalog (tsDetect and related research): https://testsmells.org
- van Deursen, A., Moonen, L., van den Bergh, A. and Kok, G. (2001). "Refactoring Test Code". *Proceedings of the 2nd International Conference on Extreme Programming and Flexible Processes (XP2001)*.
