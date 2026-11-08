"""Parcel shipping rate calculation."""

# REFACTOR: Remove Inappropriate Information. The history of authors, dates and tickets has
# been removed: it lives in `git log`/`git blame` and in the issue tracker. Only comments
# that explain business rules the code cannot express remain.

BASE_RATE = 4.5
RATE_PER_KG = 1.2
# Sea freight to the islands adds a fixed cost per parcel.
ISLANDS_SURCHARGE = 6.0


def shipping_cost(weight_kg: float, to_islands: bool) -> float:
    """Return the shipping cost in euros, rounded to cents."""
    cost = BASE_RATE + weight_kg * RATE_PER_KG
    if to_islands:
        cost += ISLANDS_SURCHARGE
    return round(cost, 2)
