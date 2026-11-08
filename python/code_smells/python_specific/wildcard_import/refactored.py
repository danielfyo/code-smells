"""Budget for a circular garden."""

import math

# REFACTOR: Replace Wildcard Import with Explicit Imports. Each name is imported explicitly
# (or used with the module prefix), so its origin is obvious and there are no silent
# collisions.
from .geometry import area, perimeter

LAWN_PRICE_PER_M2 = 4.0
FENCE_PRICE_PER_M = 12.0


def garden_budget(radius: float) -> float:
    lawn = area(radius) * LAWN_PRICE_PER_M2
    fence = perimeter(radius) * FENCE_PRICE_PER_M
    return round(lawn + fence, 2)


def circle_area_quick(radius: float) -> float:
    return round(math.pi * radius**2, 4)
