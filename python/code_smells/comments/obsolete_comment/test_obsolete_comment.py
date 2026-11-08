"""The tests document the real behavior (the one the obsolete comment contradicts)."""

import pytest

from . import refactored, smelly


@pytest.mark.parametrize("module", [smelly, refactored])
def test_locks_after_five_failures_not_three(module) -> None:
    guard = module.LoginGuard()
    for _ in range(3):
        guard.register_failure("anna")
    assert not guard.is_locked("anna"), "the obsolete comment claimed 3 attempts"
    for _ in range(2):
        guard.register_failure("anna")
    assert guard.is_locked("anna")


@pytest.mark.parametrize("module", [smelly, refactored])
def test_success_resets_counter(module) -> None:
    guard = module.LoginGuard()
    for _ in range(5):
        guard.register_failure("louis")
    guard.register_success("louis")
    assert not guard.is_locked("louis")


@pytest.mark.parametrize("module", [smelly, refactored])
def test_lock_is_thirty_minutes(module) -> None:
    assert module.LoginGuard().lock_minutes() == 30
