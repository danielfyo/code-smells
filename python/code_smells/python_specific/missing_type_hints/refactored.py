"""Public API for planning delivery routes."""

import math
from typing import NamedTuple

# REFACTOR: Add Type Hints + Introduce Value Types. The public API declares precise types: a
# named `Point` instead of anonymous tuples, a mapping of stops and a typed result
# (`RoutePlan`) instead of a dict. mypy and the IDE can check the callers.


class Point(NamedTuple):
    x: float
    y: float


class RoutePlan(NamedTuple):
    route: list[str]
    km: float


def distance(a: Point, b: Point) -> float:
    return math.dist(a, b)


def plan_route(depot: Point, stops: dict[str, Point]) -> RoutePlan:
    """Greedy route: always visit the nearest pending stop."""
    route: list[str] = []
    current = depot
    pending = dict(stops)
    total = 0.0
    while pending:
        name = min(pending, key=lambda stop: distance(current, pending[stop]))
        total += distance(current, pending[name])
        current = pending.pop(name)
        route.append(name)
    return RoutePlan(route, round(total, 2))
