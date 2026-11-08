"""Smelly tests: Untested Boundaries."""

from .production import ticket_price


# SMELL: Untested Boundaries. Only "comfortable" values from the middle of each band are
# tested (3, 10, 30, 80). The boundaries 5/6, 17/18, 64/65 and age 0 or negative are not:
# a `<` swapped for `<=` (the most typical bug) would go unnoticed.
def test_child() -> None:
    assert ticket_price(3) == 0.0


def test_teen() -> None:
    assert ticket_price(10) == 6.0


def test_adult() -> None:
    assert ticket_price(30) == 12.0


def test_senior() -> None:
    assert ticket_price(80) == 6.0
