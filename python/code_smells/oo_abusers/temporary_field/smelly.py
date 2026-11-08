"""Smelly version: fields that only make sense during one specific calculation."""


class RouteOptimizer:
    def __init__(self, depot: tuple[float, float]) -> None:
        self.depot = depot
        # SMELL: Temporary Field. These attributes are only filled while `plan()`
        # runs. The rest of the time they are None/[] and any other method reading
        # them outside that moment will get garbage.
        self._pending: list[tuple[float, float]] | None = None
        self._current: tuple[float, float] | None = None
        self._distance: float | None = None

    def plan(self, stops: list[tuple[float, float]]) -> tuple[list[tuple[float, float]], float]:
        self._pending = list(stops)
        self._current = self.depot
        self._distance = 0.0
        route = []
        while self._pending:
            nxt = min(self._pending, key=self._dist_from_current)
            self._distance += self._dist_from_current(nxt)
            self._current = nxt
            self._pending.remove(nxt)
            route.append(nxt)
        result = (route, round(self._distance, 3))
        # SMELL: you have to remember to "clean up" the temporary state.
        self._pending = self._current = self._distance = None
        return result

    def _dist_from_current(self, p: tuple[float, float]) -> float:
        assert self._current is not None  # only valid inside plan()
        return ((p[0] - self._current[0]) ** 2 + (p[1] - self._current[1]) ** 2) ** 0.5
