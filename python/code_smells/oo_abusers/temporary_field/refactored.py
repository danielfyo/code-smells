"""Refactored version: the temporary state lives in its own calculation object."""

from dataclasses import dataclass, field
from math import dist

Point = tuple[float, float]


# REFACTOR: Extract Class / Replace Method with Method Object. The temporary fields
# move to an object that only exists while the calculation runs; that way they always
# hold a valid value and there is nothing to "clean up".
@dataclass
class _NearestNeighbourRun:
    current: Point
    pending: list[Point]
    route: list[Point] = field(default_factory=list)
    distance: float = 0.0

    def run(self) -> tuple[list[Point], float]:
        while self.pending:
            nxt = min(self.pending, key=lambda p: dist(p, self.current))
            self.distance += dist(nxt, self.current)
            self.current = nxt
            self.pending.remove(nxt)
            self.route.append(nxt)
        return self.route, round(self.distance, 3)


@dataclass(frozen=True)
class RouteOptimizer:
    # REFACTOR: the optimizer only keeps what is permanent: the depot.
    depot: Point

    def plan(self, stops: list[Point]) -> tuple[list[Point], float]:
        return _NearestNeighbourRun(self.depot, list(stops)).run()
