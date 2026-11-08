# Swallowed Exceptions / Afraid to Fail

> **ID:** CS046 · **Category:** Error Handling · **Sources:** Jerzyk 2023; Clean Code

*Catching errors and doing nothing (or only logging them), leaving the system in an inconsistent state.*

## Definition

An exception (or an error value) is caught and discarded: the `catch`/`except` block is empty, only writes a
log line, or returns a default value that hides the failure. The program carries on as if nothing had
happened, even though the operation did not complete. Jerzyk and Madeyski also catalog it as *Afraid to
Fail*: the code prefers to pretend success rather than report a failure to someone who could handle it.

## Symptoms

- `except: pass`, `catch {}` or `catch (e) { console.log(e) }` blocks that neither rethrow nor return an error.
- In Go, `_ = repo.Save(order)` or calls whose returned `error` is simply never checked.
- Functions that return `None`, `false`, `0` or an empty list when something went wrong.
- Broad catches (`Exception`, `catch (e)`) that lump programming errors together with expected failures.
- Production incidents that leave no trace: "the order was not saved, but there is no error anywhere".

## Common causes

- Rushing to make a screen or a test "stop failing".
- Not knowing what to do with the error at that level, and not considering propagating it.
- Fear that an exception will crash the process, instead of defining a top-level handler.
- Defensive code copied from elsewhere without understanding which exceptions can actually be thrown.

## Why it is a problem

- **Inconsistent state**: stock is reserved but the order is not recorded, or a payment is taken without an invoice.
- **Very expensive debugging**: the symptom shows up far from the cause and without a stack trace.
- **Hidden programming errors** (`TypeError`, `NullReferenceException`) that should surface early.
- Callers cannot react (retry, compensate, notify the user) because they never find out.

## Example (smelly)

```python
def place_order(order: Order, inventory: Inventory, repo: OrderRepository) -> None:
    inventory.reserve(order.items)
    try:
        repo.save(order)
    except Exception:
        # SMELL: the failure vanishes; stock stays reserved and the order does not exist
        pass
```

## Solution (refactored)

```python
class OrderNotSaved(Exception):
    pass


def place_order(order: Order, inventory: Inventory, repo: OrderRepository) -> None:
    reservation = inventory.reserve(order.items)
    try:
        repo.save(order)
    except StorageError as exc:
        # REFACTOR: undo the partial effect and propagate a domain error
        reservation.release()
        raise OrderNotSaved(order.id) from exc
```

Only the expected exception (`StorageError`) is caught, the partial effect is undone and a domain-level error
is raised, chaining the original cause (`from exc`). Any other error keeps propagating.

## Recommended refactorings

- **Catch only specific exceptions** and let everything else propagate to a top-level handler.
- **Replace Error Code with Exception** when the silence comes from returning a sentinel value.
- **Wrap and rethrow** a domain exception that keeps the cause (`raise ... from`, `InnerException`, `fmt.Errorf("...: %w", err)`).
- **Extract Function** to isolate the `try` block and its recovery policy in one place.
- If ignoring really is intended, make it **explicit and documented** (`contextlib.suppress(FileNotFoundError)`).

## When it may be acceptable

- Genuinely irrelevant, narrowly scoped errors, e.g. deleting a temporary file that may not exist; even then, suppress only that specific type.
- Cleanup code in `finally`/`defer` where a second error must not mask the original one (log it).
- Top-level handlers (event loop, HTTP middleware) that log the error with context and return a controlled response: that is *handling* the error, not swallowing it.

## Related smells

- [Returning Error Codes](error-codes.md): returning a sentinel value is another way of hiding the failure.
- [Exceptions for Control Flow](exceptions-for-control-flow.md): the opposite abuse: using exceptions for what is not exceptional.
- [Overridden Safeties](overridden-safeties.md): silencing warnings and tests shares the same motivation.
- [Bare except](../14-python/bare-except.md): the Python-specific variant with an untyped `except:`.
- [Catching General Exception](../15-csharp/catch-general-exception.md): catching `Exception` in C#.
- [Ignored Errors](../17-go/ignored-errors.md): the idiomatic Go version: returned errors that nobody checks.

## Automatic detection

- **Python**: Pylint `W0702` (`bare-except`) and `W0718` (`broad-exception-caught`); Ruff `E722`, `BLE001` (blind except), `S110` (`try-except-pass`), `S112` (`try-except-continue`) and `SIM105` (suggests `contextlib.suppress`).
- **C#**: Roslyn analyzer `CA1031` (*Do not catch general exception types*); SonarQube `S108` (empty blocks) and `S2486` (ignored exceptions).
- **TypeScript**: ESLint `no-empty` (empty `catch` blocks), `no-useless-catch` and `@typescript-eslint/no-floating-promises` for promises whose rejection nobody handles.
- **Go**: golangci-lint with `errcheck` (unchecked errors), `nilerr` (returning `nil` while holding an error) and `gosec` `G104`.

## Implementations

- Python: [`python/code_smells/error_handling/swallowed_exceptions/`](../../../python/code_smells/error_handling/swallowed_exceptions/)
- C#: [`csharp/src/CodeSmells/ErrorHandling/SwallowedExceptions/`](../../../csharp/src/CodeSmells/ErrorHandling/SwallowedExceptions/)
- React + TS: [`react-ts/src/smells/error_handling/swallowed-exceptions/`](../../../react-ts/src/smells/error_handling/swallowed-exceptions/)
- Go: [`go/smells/error_handling/swallowed-exceptions/`](../../../go/smells/error_handling/swallowed-exceptions/)
- Angular: [`angular/src/smells/error_handling/swallowed-exceptions/`](../../../angular/src/smells/error_handling/swallowed-exceptions/)

Each folder contains a `smelly` version (the smell, marked with `SMELL:` comments) and a `refactored` version (marked with `REFACTOR:` comments), plus tests showing that both have the same observable behavior.

## References

- Martin, R. C. (2008). *Clean Code*, ch. 7 "Error Handling" (by Michael Feathers). Prentice Hall.
- Jerzyk, M. and Madeyski, L. (2023). "Code Smells: A Comprehensive Online Catalog and Taxonomy". Online catalog: https://codesmells.org
- Cwalina, K. and Abrams, B. *Framework Design Guidelines* (Addison-Wesley), exception design chapter; also summarized in the .NET documentation ("Best practices for exceptions") on Microsoft Learn.
- Hunt, A. and Thomas, D. (2019). *The Pragmatic Programmer* (20th anniversary ed.). Addison-Wesley.
- Fowler, M. *CodeSmell* (bliki): https://martinfowler.com/bliki/CodeSmell.html
