"""Product catalog."""


# REFACTOR: Rename to Standard Nomenclature. PascalCase for classes, snake_case for methods
# and attributes, language protocols (`__len__`, `__contains__`) and an alternative
# constructor with the idiomatic name `from_prices` (classmethod) instead of a "Maker".
class ProductCatalog:
    def __init__(self) -> None:
        self._prices: dict[str, float] = {}

    @classmethod
    def from_prices(cls, prices: dict[str, float]) -> "ProductCatalog":
        catalog = cls()
        for sku, price in prices.items():
            catalog.add(sku, price)
        return catalog

    def add(self, sku: str, price: float) -> None:
        self._prices[sku] = price

    def __len__(self) -> int:
        return len(self._prices)

    def __contains__(self, sku: object) -> bool:
        return sku in self._prices
