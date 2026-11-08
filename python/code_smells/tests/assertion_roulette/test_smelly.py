"""Smelly tests: Assertion Roulette."""

from datetime import date

from .production import parse_order


# SMELL: Assertion Roulette. Many assertions with no message and no clear relationship in a
# single test. When it fails, the report says "assert False" on line N and you have to open
# the code to guess which field failed and for which input.
def test_parse_order() -> None:
    o = parse_order("A-1; anna smith ;2026-02-01; 15,50 ;yes")
    assert o.order_id == "A-1"
    assert o.customer == "Anna Smith"
    assert o.placed_on == date(2026, 2, 1)
    assert o.total == 15.5
    assert o.is_express
    o = parse_order("B-2;louis;2026-02-03;7;no")
    assert not o.is_express
    assert o.total == 7
    assert o.customer == "Louis"
