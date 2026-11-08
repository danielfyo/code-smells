"""Product catalog (smelly version)."""


# SMELL: Non-Standard Nomenclature. Ignores Python conventions (PEP 8) and well-known
# pattern names: a lowercase class, camelCase methods, a "factory" called `Maker`, and
# reinvented language protocols (`getLength`, `hasItem`) instead of `__len__` and
# `__contains__`. Anyone who knows Python cannot find what they expect.
class product_list:
    def __init__(self) -> None:
        self.Items: dict[str, float] = {}

    def AddItem(self, Sku: str, Price: float) -> None:
        self.Items[Sku] = Price

    def getLength(self) -> int:
        return len(self.Items)

    def hasItem(self, Sku: str) -> bool:
        return Sku in self.Items


class ProductListMaker:
    """It is really a Factory, but nobody would look for it under this name."""

    @staticmethod
    def DoIt(prices: dict[str, float]) -> product_list:
        result = product_list()
        for sku, price in prices.items():
            result.AddItem(sku, price)
        return result
