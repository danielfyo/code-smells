"""Code under test: shopping cart with volume discounts."""


class ShoppingCart:
    def __init__(self) -> None:
        self._items: dict[str, tuple[float, int]] = {}

    def add(self, sku: str, unit_price: float, quantity: int = 1) -> None:
        price, current = self._items.get(sku, (unit_price, 0))
        self._items[sku] = (price, current + quantity)

    def _subtotal(self) -> float:
        return sum(price * qty for price, qty in self._items.values())

    def _discount_rate(self) -> float:
        units = sum(qty for _, qty in self._items.values())
        return 0.10 if units >= 10 else 0.0

    def total(self) -> float:
        return round(self._subtotal() * (1 - self._discount_rate()), 2)

    def summary(self) -> str:
        return f"{len(self._items)} products, total {self.total():.2f} EUR"
