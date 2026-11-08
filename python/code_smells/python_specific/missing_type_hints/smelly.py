"""Public API for planning delivery routes (smelly version)."""

from typing import Any


# SMELL: Missing Type Hints. The public API has no annotations or uses `Any` everywhere. Is
# `stops` a list of names, of tuples, of dicts? What does `plan_route` return? Neither the
# reader, nor the IDE, nor mypy knows; errors show up in production.
def distance(a, b):
    return ((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2) ** 0.5


def plan_route(depot, stops: Any) -> Any:
    route, current, pending = [], depot, dict(stops)
    total = 0.0
    while pending:
        name = min(pending, key=lambda n: distance(current, pending[n]))
        total += distance(current, pending[name])
        current = pending.pop(name)
        route.append(name)
    return {"route": route, "km": round(total, 2)}
