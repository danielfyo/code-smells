# Bare except

> **ID:** CS094 · **Category:** Python-specific · **Sources:** PEP 8; Pylint W0702

## Definition

A `try` block uses `except:` without naming any exception type. That clause catches **every** exception,
including `KeyboardInterrupt`, `SystemExit` and `GeneratorExit`, which are not program errors but control signals.
The result is code that hides real failures and can even prevent the process from being stopped with Ctrl+C.

## Symptoms

- `except:` followed by `pass`, `return None`, `continue` or a generic `print`.
- Near-equivalent variants: `except BaseException:` without re-raising, or an overly broad `except Exception:`.
- Scripts that "cannot be stopped" or exit without any error message.
- Typos (`NameError`, `AttributeError`) that are never seen.

## Common causes

- "Just don't crash": silencing an intermittent error instead of understanding it.
- Not knowing Python's exception hierarchy.
- Code copied from quick examples or from Python 2.

## Why it is a problem

- **Hides programming errors**: a `KeyError` caused by a misspelled key is treated like a network failure.
- **Breaks orderly shutdown**: `sys.exit()` raises `SystemExit`; if it is caught, the process keeps running.
- **Prevents user interruption** (`KeyboardInterrupt`) and can interfere with task cancellation in `asyncio`
  (`asyncio.CancelledError` inherits from `BaseException` since Python 3.8).
- Corrupted data: the program carries on in an inconsistent state.

## How it works under the hood

The root of the hierarchy is `BaseException`. Directly below it are `SystemExit`, `KeyboardInterrupt`,
`GeneratorExit` and `Exception`; almost all "error" exceptions inherit from `Exception`. An untyped `except:` is
equivalent to `except BaseException:`, so it also catches the control signals. PEP 8 recommends catching specific
exceptions and, when something broad is truly needed, `except Exception:`, which lets the exit and interrupt
signals through.

## Example (smelly)

```python
import json


def load_order(path: str) -> dict | None:
    try:
        with open(path, encoding="utf-8") as fh:
            return json.load(fh)
    except:  # SMELL: catches everything, even Ctrl+C and programming errors
        return None
```

## Solution (refactored)

```python
import json
import logging

logger = logging.getLogger(__name__)


def load_order(path: str) -> dict | None:
    try:
        with open(path, encoding="utf-8") as fh:
            return json.load(fh)
    except FileNotFoundError:
        # REFACTOR: only the expected failures, each with a specific treatment
        logger.info("Order not found: %s", path)
        return None
    except json.JSONDecodeError as exc:
        raise ValueError(f"Corrupted order in {path}") from exc
```

## Recommended refactorings

- **Catch specific exceptions** that the code knows how to handle.
- **Re-raise with context** (`raise NewException(...) from exc`) instead of silencing.
- If a general barrier is needed (main loop, worker), use `except Exception:` and **log** with
  `logger.exception(...)`, never `pass`.
- For cleanup, prefer `finally` or context managers (`with`) over catching.

## When it may be acceptable

- An `except BaseException:` that cleans up resources and immediately **re-raises** with `raise`.
- The outermost level of a process (for example, a supervisor that logs any failure before exiting), always
  re-raising or exiting explicitly.

## Related smells

- [Swallowed Exceptions / Afraid to Fail](../08-error-handling/swallowed-exceptions.md)
- [Exceptions for Control Flow](../08-error-handling/exceptions-for-control-flow.md)
- [Catching General Exception (C#)](../15-csharp/catch-general-exception.md)
- [Overridden Safeties](../08-error-handling/overridden-safeties.md)

## Automatic detection

- **Pylint** `W0702` `bare-except` and `W0718` `broad-exception-caught` (formerly `W0703 broad-except`).
- **pycodestyle / Ruff** `E722` (do not use bare `except`).
- **flake8-bugbear / Ruff** `B001`; **Ruff** `BLE001` (blind except) for `except Exception` without re-raising.
- **Bandit** `B110` (`try_except_pass`).

## Implementations

- Python: [`python/code_smells/python_specific/bare_except/`](../../../python/code_smells/python_specific/bare_except/)

Python-specific smell: there is no implementation in the other languages of the repository.

## References

- PEP 8, *Programming Recommendations*: https://peps.python.org/pep-0008/#programming-recommendations
- Python docs, *Exception hierarchy*: https://docs.python.org/3/library/exceptions.html#exception-hierarchy
- Python Language Reference, *The try statement*:
  https://docs.python.org/3/reference/compound_stmts.html#the-try-statement
- The Little Book of Python Anti-Patterns: https://docs.quantifiedcode.com/python-anti-patterns/
