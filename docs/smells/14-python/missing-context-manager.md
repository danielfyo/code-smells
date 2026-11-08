# Not Using Context Managers

> **ID:** CS099 · **Category:** Python-specific · **Sources:** PEP 343

## Definition

Resources (files, connections, sockets, locks, transactions) are acquired and released manually with `close()`,
`release()` or `commit()` instead of using the `with` statement. If an exception occurs between acquisition and
release, the resource stays open.

## Symptoms

- `f = open(path)` ... `f.close()` without `try/finally`.
- `lock.acquire()` without the matching `release()` in a `finally`.
- Database connections opened in one function and closed "further down".
- `ResourceWarning: unclosed file` when running with `-W default` or in the test suite.
- "Too many open files" errors or exhausted connection pools in production.

## Common causes

- Habits from other languages or from older Python versions.
- Believing the garbage collector will close the resource "in time".
- In-house APIs that do not implement the context manager protocol.

## Why it is a problem

- **Resource leaks** when the happy path is interrupted by an exception or an early `return`.
- **Unwritten data**: file buffers may not be flushed if the file is never closed.
- **Locks never released**, blocking every other thread.
- Longer, more error-prone code when several `try/finally` blocks are nested.

## How it works under the hood

`with expr as x:` (PEP 343) calls `expr.__enter__()` and binds the result to `x`; when leaving the block — normal
completion, `return`, `break` or exception — it **always** calls `__exit__(type, value, traceback)`. It is
equivalent to a well-written `try/finally`, but encapsulated in the resource's own type. If `__exit__` returns a
truthy value, the exception is suppressed. In CPython a file with no references is usually closed promptly thanks to
reference counting, but this is not guaranteed (cycles, PyPy, references held by tracebacks), so it must not be
relied upon. `contextlib` provides `@contextmanager`, `closing`, `suppress` and `ExitStack` to build or combine
context managers.

## Example (smelly)

```python
import sqlite3


def export_orders(db_path: str, out_path: str) -> int:
    conn = sqlite3.connect(db_path)
    out = open(out_path, "w", encoding="utf-8")
    rows = conn.execute("SELECT id, total FROM orders").fetchall()
    for order_id, total in rows:
        out.write(f"{order_id};{total}\n")   # SMELL: if this fails, nothing is closed
    out.close()
    conn.close()
    return len(rows)
```

## Solution (refactored)

```python
import sqlite3
from contextlib import closing


def export_orders(db_path: str, out_path: str) -> int:
    # REFACTOR: with guarantees cleanup even when exceptions occur
    with closing(sqlite3.connect(db_path)) as conn, \
         open(out_path, "w", encoding="utf-8") as out:
        rows = conn.execute("SELECT id, total FROM orders").fetchall()
        out.writelines(f"{order_id};{total}\n" for order_id, total in rows)
    return len(rows)
```

Note: using a `sqlite3` connection in `with` manages the **transaction** (commit/rollback), not closing; that is
why `contextlib.closing` is used.

## Recommended refactorings

- **Wrap acquisition in `with`** for files, locks, connections and transactions.
- **Implement `__enter__`/`__exit__`** (or use `@contextmanager`) in your own resource-owning classes.
- **`contextlib.ExitStack`** for a variable number of resources.
- `contextlib.closing` for objects that only have `close()`.

## When it may be acceptable

- Resources whose lifetime matches a larger object that already implements the protocol and closes them in its own
  `__exit__`.
- Throwaway scripts that exit immediately (even then, `with` costs nothing).

## Related smells

- [Missing using / IDisposable Leak (C#)](../15-csharp/missing-dispose.md)
- [defer in Loop (Go)](../17-go/defer-in-loop.md)
- [Missing Effect Cleanup (React + TS)](../16-react-ts/missing-effect-cleanup.md)
- [Hidden Temporal Coupling](../05-couplers/hidden-temporal-coupling.md)

## Automatic detection

- **Pylint** `R1732` `consider-using-with`.
- **Ruff** `SIM115` (`open-file-with-context-handler`, from flake8-simplify).
- At runtime: `python -W default` or `-X dev` shows `ResourceWarning` for unclosed resources; pytest can turn them
  into errors with `-W error::ResourceWarning`.

## Implementations

- Python: [`python/code_smells/python_specific/missing_context_manager/`](../../../python/code_smells/python_specific/missing_context_manager/)

Python-specific smell: there is no implementation in the other languages of the repository.

## References

- PEP 343, *The "with" Statement*: https://peps.python.org/pep-0343/
- Python Language Reference, *The with statement*:
  https://docs.python.org/3/reference/compound_stmts.html#the-with-statement
- Python docs, `contextlib`: https://docs.python.org/3/library/contextlib.html
- The Little Book of Python Anti-Patterns: https://docs.quantifiedcode.com/python-anti-patterns/
