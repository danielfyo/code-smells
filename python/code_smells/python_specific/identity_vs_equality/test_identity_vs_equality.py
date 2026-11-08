"""Shows that `is` works by chance with small values and fails with large ones."""

import warnings

with warnings.catch_warnings():
    warnings.simplefilter("ignore", SyntaxWarning)
    from . import smelly

from . import refactored


def _runtime_int(text: str) -> int:
    return int(text)  # creates a new object at runtime


def test_small_values_work_by_chance() -> None:
    assert smelly.is_full(_runtime_int("100"), 100)
    assert refactored.is_full(_runtime_int("100"), 100)


def test_smelly_fails_with_large_capacities() -> None:
    assert not smelly.is_full(_runtime_int("5000"), _runtime_int("5000"))  # bug!
    assert refactored.is_full(_runtime_int("5000"), _runtime_int("5000"))


def test_smelly_fails_with_runtime_strings() -> None:
    ticket = "".join(["V", "I", "P"])  # noqa: FLY002 (string built at runtime)
    assert not smelly.is_vip(ticket)  # bug!
    assert refactored.is_vip(ticket)
