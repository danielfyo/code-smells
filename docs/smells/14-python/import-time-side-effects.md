# Import-time Side Effects

> **ID:** CS111 · **Category:** Python-specific · **Sources:** Python community

## Definition

A module performs side-effecting or expensive work **at module level**, i.e. at the moment it is imported: it opens
database connections, reads configuration files, calls APIs, configures global logging, starts threads or loads
heavy models. Merely importing the module — from a test, a tool or the documentation build — triggers all of it.

## Symptoms

- `db = psycopg.connect(os.environ["DATABASE_URL"])` or `config = json.load(open("config.json"))` at the top level.
- Tests fail at *import* time (before anything runs) when there is no network, database or environment variables.
- Starting the CLI or running `--help` takes several seconds.
- `logging.basicConfig(...)` or `sys.path.append(...)` outside any function.
- Import cycles caused by initialization.

## Common causes

- Scripts that turned into reusable modules without moving code into functions.
- Convenience: having the client "ready to use" with a simple import.
- No `if __name__ == "__main__":` block.

## Why it is a problem

- **Slow, fragile tests**: the code cannot be imported without the full environment.
- **Impossible to configure or substitute** the dependency (another database URL, a test double).
- **Import order matters**: behaviour differs depending on what is imported first.
- **Hard-to-diagnose errors** (exceptions with tracebacks deep inside `importlib`).
- Problems with multiprocessing (`fork`/`spawn`) as the code re-runs in each child process.

## How it works under the hood

Importing a module for the first time **executes all its top-level code** from top to bottom and stores the
resulting module object in `sys.modules`; later imports reuse that cache without re-executing. So any call at module
level runs once per process, at the moment someone imports the module, whoever that is. The
`if __name__ == "__main__":` block only runs when the file is launched as a program (`python module.py` or
`python -m package.module`). `python -X importtime` measures how long each import takes.

## Example (smelly)

```python
# orders/repository.py
import json
import sqlite3

# SMELL: all of this happens as soon as someone does `import orders.repository`
with open("settings.json", encoding="utf-8") as fh:
    SETTINGS = json.load(fh)
CONNECTION = sqlite3.connect(SETTINGS["db_path"])
CONNECTION.execute("CREATE TABLE IF NOT EXISTS orders (id INTEGER, total REAL)")


def count_orders() -> int:
    return CONNECTION.execute("SELECT COUNT(*) FROM orders").fetchone()[0]
```

## Solution (refactored)

```python
# orders/repository.py
import sqlite3


class OrderRepository:
    # REFACTOR: the connection is injected; importing the module has no effects
    def __init__(self, connection: sqlite3.Connection) -> None:
        self._conn = connection

    def ensure_schema(self) -> None:
        self._conn.execute("CREATE TABLE IF NOT EXISTS orders (id INTEGER, total REAL)")

    def count_orders(self) -> int:
        return self._conn.execute("SELECT COUNT(*) FROM orders").fetchone()[0]


# main.py (composition root): reads the configuration and creates the connection at startup
```

## Recommended refactorings

- **Move the work into functions** (`main()`, `create_app()`, `load_settings()`) called explicitly.
- **Dependency injection**: receive connections and configuration as parameters.
- **Lazy initialization** (`functools.cache` on a `get_client()` function) when a single shared resource is needed.
- **`if __name__ == "__main__":` block** for script code.
- Configure `logging` only at the application entry point, never in libraries.

## When it may be acceptable

- Cheap, pure definitions: constants, compiled regular expressions (`re.compile`), lookup tables, class registration
  through decorators.
- Creating a `logging.getLogger(__name__)` (it configures nothing; it just obtains a logger).
- The application's entry-point module (although even there a `main` function is preferable).

## Related smells

- [global Statement](global-statement.md)
- [Global Data](../05-couplers/global-data.md)
- [init() Abuse (Go)](../17-go/init-abuse.md)
- [Slow Tests](../12-tests/slow-tests.md)
- [Mystery Guest](../12-tests/mystery-guest.md)

## Automatic detection

No standard Pylint or Ruff rule detects import side effects in general. They are found with `python -X importtime`,
by importing the module in an environment with no network or environment variables (a "smoke import" test), and in
code review. Pylint `W1514` `unspecified-encoding` and Ruff `SIM115` may fire in these blocks, but they do not point
to the underlying problem.

## Implementations

- Python: [`python/code_smells/python_specific/import_time_side_effects/`](../../../python/code_smells/python_specific/import_time_side_effects/)

Python-specific smell: there is no implementation in the other languages of the repository.

## References

- Python docs, `__main__` — *Top-level code environment*: https://docs.python.org/3/library/__main__.html
- Python Language Reference, *The import system*: https://docs.python.org/3/reference/import.html
- Python docs, `-X importtime`: https://docs.python.org/3/using/cmdline.html#cmdoption-X
- Python docs, *Logging HOWTO — Configuring Logging for a Library*:
  https://docs.python.org/3/howto/logging.html#configuring-logging-for-a-library
