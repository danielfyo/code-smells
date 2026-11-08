"""Each of the 7 combined functions is equivalent to composing specifications."""

from typing import Any

from code_smells.change_preventers.combinatorial_explosion import refactored as r
from code_smells.change_preventers.combinatorial_explosion import smelly as s

RAW = [
    ("Drill", "tools", 60.0, True),
    ("Hammer", "tools", 12.0, False),
    ("Lamp", "home", 25.0, True),
    ("Sofa", "home", 400.0, True),
]
OLD = [s.Product(*x) for x in RAW]
NEW = [r.Product(*x) for x in RAW]


def names(products: list[Any]) -> list[str]:
    return [p.name for p in products]


def test_all_combinations_match() -> None:
    cases = [
        (s.find_by_category(OLD, "tools"), [r.category_is("tools")]),
        (s.find_by_max_price(OLD, 30), [r.price_at_most(30)]),
        (s.find_in_stock(OLD), [r.in_stock()]),
        (
            s.find_by_category_and_max_price(OLD, "home", 100),
            [r.category_is("home"), r.price_at_most(100)],
        ),
        (s.find_by_category_in_stock(OLD, "tools"), [r.category_is("tools"), r.in_stock()]),
        (s.find_by_max_price_in_stock(OLD, 70), [r.price_at_most(70), r.in_stock()]),
        (
            s.find_by_category_and_max_price_in_stock(OLD, "tools", 100),
            [r.category_is("tools"), r.price_at_most(100), r.in_stock()],
        ),
    ]
    for expected, specs in cases:
        assert names(expected) == names(r.find(NEW, *specs))
