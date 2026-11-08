"""Refactored version: immutable price lists; changes create copies."""

from collections.abc import Mapping
from dataclasses import dataclass
from types import MappingProxyType


@dataclass(frozen=True)
class PriceList:
    prices: Mapping[str, float]

    def __post_init__(self) -> None:
        # REFACTOR: defensive copy + read-only view: nobody can mutate it.
        object.__setattr__(self, "prices", MappingProxyType(dict(self.prices)))

    # REFACTOR: Change Reference to Value / Separate Query from Modifier. The
    # operation returns a new list and leaves the original intact.
    def with_discount(self, pct: float) -> "PriceList":
        return PriceList({sku: round(p * (1 - pct), 2) for sku, p in self.prices.items()})

    def apply_black_friday(self) -> "PriceList":
        return self.with_discount(0.30)


def quote(price_list: PriceList, sku: str, qty: int) -> float:
    return round(price_list.prices[sku] * qty, 2)
