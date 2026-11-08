# Python-specific Smells

Idiomatic Python anti-patterns. These smells come from the way the language itself works: when default arguments
are evaluated, how closures resolve names, the exception hierarchy, the import system, the difference between
identity and equality, and the fact that type hints are not checked at runtime. Generic smells (Long Method,
Feature Envy...) apply to Python too; the ones listed here are specific to Python or take a form that only makes
sense in Python.

Each document follows the same structure: definition, symptoms, common causes, why it is a problem, how it works
under the hood, smelly and refactored snippets, recommended refactorings, exceptions, related smells, automatic
detection (Pylint, Ruff/flake8, Bandit, mypy) and references. The runnable code (`smelly.py`, `refactored.py` and
tests) lives in [`python/code_smells/python_specific/`](../../../python/code_smells/python_specific/).

## Smells in this category

| ID | Smell | Summary |
|---|---|---|
| CS093 | [Mutable Default Argument](mutable-default-argument.md) | Default values are evaluated once: a default list is shared between calls. |
| CS094 | [Bare except](bare-except.md) | `except:` catches even `KeyboardInterrupt` and `SystemExit` and hides real errors. |
| CS095 | [Wildcard Import](wildcard-import.md) | `from x import *` pollutes the namespace and hides where each name comes from. |
| CS096 | [Using `is` for Value Comparison](identity-vs-equality.md) | Comparing values with `is` works by accident (integer caching) and fails intermittently. |
| CS097 | [Late-Binding Closures](late-binding-closures.md) | Lambdas created in a loop capture the variable, not its value: they all see the last one. |
| CS098 | [Java-style Getters and Setters](java-style-getters-setters.md) | Trivial `get_x`/`set_x` methods instead of attributes or `@property`. |
| CS099 | [Not Using Context Managers](missing-context-manager.md) | Opening resources without `with`, risking leaks when an exception occurs. |
| CS100 | [range(len()) Iteration](range-len-iteration.md) | Manual indexing instead of direct iteration or `enumerate`/`zip`. |
| CS101 | [Type Checking with type()](type-checking-with-type.md) | `type(x) == Class` breaks inheritance; use `isinstance` or, better, polymorphism. |
| CS102 | [String Concatenation in Loop](string-concatenation-in-loop.md) | `s += x` in a loop is quadratic and less readable; use `str.join` or f-strings. |
| CS103 | [global Statement](global-statement.md) | Functions that modify module variables with `global`. |
| CS104 | [Monkey Patching in Production Code](monkey-patching.md) | Modifying foreign classes or modules at runtime from production code. |
| CS105 | [Stringly-typed Dicts instead of Classes](dict-as-object.md) | Passing dicts with magic keys instead of dataclasses, `NamedTuple` or `TypedDict`. |
| CS106 | [Reinventing the Standard Library](reinventing-stdlib.md) | Hand-writing what `collections`, `itertools`, `pathlib`, etc. already provide. |
| CS107 | [Shadowing Built-ins](shadowing-builtins.md) | Naming variables `list`, `dict`, `id`, `type`, `input`... and hiding the built-ins. |
| CS108 | [assert for Data Validation](assert-for-validation.md) | Assertions disappear with `python -O`; they cannot validate input data. |
| CS109 | [Inconsistent Return Statements](inconsistent-return.md) | Some branches return a value and others implicitly return `None`. |
| CS110 | [Overly Complex Comprehension](complex-comprehension.md) | Comprehensions with several `for`, `if` and nested logic on one line. |
| CS111 | [Import-time Side Effects](import-time-side-effects.md) | Connections, file reads or heavy work executed when a module is imported. |
| CS112 | [Missing Type Hints / Any Abuse](missing-type-hints.md) | Public APIs without annotations or full of `Any`, defeating static analysis. |

## Recommended tooling

- **Ruff** (or flake8 with plugins such as flake8-bugbear, flake8-builtins and flake8-bandit): fast linting that
  covers most of the rules cited in these documents (`B006`, `E722`, `F403`, `B023`, `S101`...).
- **Pylint**: complementary checks (`W0102`, `W0702`, `W0603`, `W0622`, `R1710`, `C0200`...).
- **mypy** or **Pyright** in strict mode: type checking for CS105 and CS112.
- **Bandit**: security-oriented checks such as `B101` (`assert_used`).

## General references

- PEP 8, *Style Guide for Python Code*: https://peps.python.org/pep-0008/
- PEP 20, *The Zen of Python*: https://peps.python.org/pep-0020/
- The Little Book of Python Anti-Patterns: https://docs.quantifiedcode.com/python-anti-patterns/
- The Hitchhiker's Guide to Python, *Common Gotchas*: https://docs.python-guide.org/writing/gotchas/
- Python documentation: https://docs.python.org/3/
