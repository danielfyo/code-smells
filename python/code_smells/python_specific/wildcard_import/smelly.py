"""Budget for a circular garden (smelly version)."""

from math import *  # noqa: F403

# SMELL: Wildcard Import. `import *` dumps dozens of names into the module. Nobody can tell
# where each one comes from and the last import silently wins: here `geometry` overwrites
# math's `pi` with 3.14, so `pi` stops being precise without anyone noticing. Linters cannot
# detect undefined names either.
from .geometry import *  # noqa: F403

LAWN_PRICE_PER_M2 = 4.0
FENCE_PRICE_PER_M = 12.0


def garden_budget(radius: float) -> float:
    lawn = area(radius) * LAWN_PRICE_PER_M2  # noqa: F405
    fence = perimeter(radius) * FENCE_PRICE_PER_M  # noqa: F405
    return round(lawn + fence, 2)


def circle_area_quick(radius: float) -> float:
    # The author believes this is math.pi, but it is geometry.pi (3.14).
    return round(pi * radius**2, 4)  # noqa: F405
