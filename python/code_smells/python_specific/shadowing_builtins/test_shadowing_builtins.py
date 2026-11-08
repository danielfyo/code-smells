from . import refactored, smelly

ITEMS = [("milk", "dairy", 1.15), ("olive oil", "pantry", 8.90), ("bread", "bakery", 0.95)]


def test_same_summary() -> None:
    expected = "Order P-9: 3 products, 11.00 EUR, most expensive: olive oil"
    assert smelly.order_summary("P-9", ITEMS) == refactored.order_summary("P-9", ITEMS) == expected


def test_empty_order() -> None:
    assert smelly.order_summary("P-0", []) == refactored.order_summary("P-0", [])
