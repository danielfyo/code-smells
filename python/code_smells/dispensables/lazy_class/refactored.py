"""Refactored version: classes with no weight are inlined where they are used."""

from dataclasses import dataclass, field

LOW_STOCK_THRESHOLD = 5


@dataclass
class Inventory:
    items: dict[str, int] = field(default_factory=dict)

    # REFACTOR: Inline Class. SkuFormatter and StockChecker disappear; their single line
    # of logic is inlined here (Inline Function) and the threshold becomes a constant.
    def add(self, sku: str, quantity: int) -> None:
        key = sku.strip().upper()
        self.items[key] = self.items.get(key, 0) + quantity

    def low_stock(self) -> list[str]:
        return sorted(s for s, q in self.items.items() if q < LOW_STOCK_THRESHOLD)
