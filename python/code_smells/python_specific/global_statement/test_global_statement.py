import pytest

from . import refactored, smelly

VISITS = ["omelette", "paella", "omelette", "ratatouille", "croquettes"]


def test_same_behavior() -> None:
    smelly.reset()
    tracker = refactored.VisitTracker()
    for recipe in VISITS:
        assert smelly.register_visit(recipe) == tracker.register_visit(recipe)
    assert (
        smelly.recent_recipes == tracker.recent_recipes == ["croquettes", "ratatouille", "omelette"]
    )


def test_smelly_state_leaks_between_callers() -> None:
    smelly.reset()
    smelly.register_visit("gazpacho")  # "user A"
    assert smelly.register_visit("stew") == 2  # "user B" sees the visits of A


@pytest.mark.parametrize("_", range(2))
def test_refactored_instances_are_isolated(_: int) -> None:
    first, second = refactored.VisitTracker(), refactored.VisitTracker()
    first.register_visit("gazpacho")
    assert second.register_visit("stew") == 1
