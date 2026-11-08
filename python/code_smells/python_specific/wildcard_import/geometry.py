"""Helper module with geometry utilities (imported by smelly.py and refactored.py)."""

import math

pi = 3.14  # a "back of the envelope" approximation for quick floor plans


def area(radius: float) -> float:
    return math.pi * radius**2


def perimeter(radius: float) -> float:
    return 2 * math.pi * radius
