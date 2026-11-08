"""Both versions produce exactly the same receipt."""

from types import ModuleType
from typing import Any

import pytest

from code_smells.bloaters.long_method import refactored, smelly

ORDERS = [
    {"customer": "Ana", "items": [{"sku": "BOOK", "price": 12.5, "qty": 2}]},
    {
        "customer": "Luis",
        "coupon": "WELCOME10",
        "items": [{"sku": "LAMP", "price": 80.0, "qty": 1}],
    },
    {"customer": "Eva", "items": [{"sku": "TV", "price": 250.0, "qty": 1}]},
]


@pytest.mark.parametrize("order", ORDERS)
def test_same_receipt(order: dict[str, Any]) -> None:
    assert smelly.process_order(order) == refactored.process_order(order)


@pytest.mark.parametrize("module", [smelly, refactored])
def test_rejects_empty_and_invalid(module: ModuleType) -> None:
    with pytest.raises(ValueError):
        module.process_order({"customer": "X", "items": []})
    with pytest.raises(ValueError):
        module.process_order({"customer": "X", "items": [{"sku": "A", "price": 1, "qty": 0}]})


def test_steps_are_testable_in_isolation() -> None:
    assert refactored.shipping_for(49.99) == 4.95
    assert refactored.discount_for(300, None) == 15.0
