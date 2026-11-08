"""Refactored version: small, composable criteria (Specification pattern)."""

from collections.abc import Callable, Iterable
from dataclasses import dataclass


@dataclass(frozen=True)
class Product:
    name: str
    category: str
    price: float
    in_stock: bool


# REFACTOR: Parameterize Function + Specification pattern. Each criterion is an
# independent piece and combinations are built instead of written by hand:
# N criteria = N functions, not 2^N - 1.
Spec = Callable[[Product], bool]


def category_is(category: str) -> Spec:
    return lambda p: p.category == category


def price_at_most(max_price: float) -> Spec:
    return lambda p: p.price <= max_price


def in_stock() -> Spec:
    return lambda p: p.in_stock


def find(products: Iterable[Product], *specs: Spec) -> list[Product]:
    return [p for p in products if all(spec(p) for spec in specs)]
