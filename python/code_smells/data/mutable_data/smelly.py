"""Smelly version: a shared price list that anyone can modify."""


class PriceList:
    def __init__(self, prices: dict[str, float]) -> None:
        # SMELL: Mutable Data. It stores a reference to the caller's dict.
        self.prices = prices

    def apply_black_friday(self) -> "PriceList":
        # SMELL: it "returns" a discounted list but actually mutates the original
        # in place: everyone sharing the reference sees the change.
        for sku in self.prices:
            self.prices[sku] = round(self.prices[sku] * 0.7, 2)
        return self


def quote(price_list: PriceList, sku: str, qty: int) -> float:
    return round(price_list.prices[sku] * qty, 2)
