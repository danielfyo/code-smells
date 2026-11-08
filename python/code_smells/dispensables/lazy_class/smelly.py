"""Smelly version: classes that do almost nothing in an inventory module."""


class SkuFormatter:
    # SMELL: Lazy Class. A whole class (instantiation included) to wrap a single
    # call to str.upper(). It adds no abstraction, only indirection.
    def format(self, sku: str) -> str:
        return sku.strip().upper()


class StockChecker:
    # SMELL: another "lazy" class: a trivial method that just compares a number.
    def __init__(self, threshold: int) -> None:
        self.threshold = threshold

    def is_low(self, quantity: int) -> bool:
        return quantity < self.threshold


class Inventory:
    def __init__(self) -> None:
        self.items: dict[str, int] = {}
        self._formatter = SkuFormatter()
        self._checker = StockChecker(5)

    def add(self, sku: str, quantity: int) -> None:
        key = self._formatter.format(sku)
        self.items[key] = self.items.get(key, 0) + quantity

    def low_stock(self) -> list[str]:
        return sorted(s for s, q in self.items.items() if self._checker.is_low(q))
