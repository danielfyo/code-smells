import asyncio

import pytest

from . import refactored, smelly


def _run_smelly(sku: str, card: str, amount: float) -> str:
    results: list[str] = []
    smelly.checkout(sku, card, amount, results.append)
    return results[0]


@pytest.mark.parametrize(
    ("sku", "card", "expected"),
    [
        ("SKU-1", "4111", "ok: TX-1999 SHIP-SKU-1"),
        ("SKU-2", "4111", "error: out of stock"),
        ("SKU-1", "5500", "error: card declined"),
    ],
)
def test_same_outcome(sku: str, card: str, expected: str) -> None:
    assert _run_smelly(sku, card, 19.99) == expected
    assert asyncio.run(refactored.checkout(sku, card, 19.99)) == expected
