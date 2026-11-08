"""Same route and distance; the refactored version leaves no dangling state."""

from code_smells.oo_abusers.temporary_field import refactored, smelly

STOPS = [(5.0, 5.0), (1.0, 0.0), (2.0, 2.0), (10.0, 0.0)]


def test_same_route() -> None:
    assert smelly.RouteOptimizer((0, 0)).plan(STOPS) == refactored.RouteOptimizer((0, 0)).plan(STOPS)


def test_smelly_has_meaningless_fields_outside_plan() -> None:
    opt = smelly.RouteOptimizer((0, 0))
    assert opt._current is None and opt._pending is None  # fields empty almost always
    assert not hasattr(refactored.RouteOptimizer((0, 0)), "_current")
