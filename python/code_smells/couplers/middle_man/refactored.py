"""Refactored version: clients use the repository directly."""

from dataclasses import dataclass, field


@dataclass
class ProductRepository:
    _products: dict[str, float] = field(default_factory=dict)

    def save(self, sku: str, price: float) -> None:
        self._products[sku] = price

    def find(self, sku: str) -> float | None:
        return self._products.get(sku)

    def delete(self, sku: str) -> None:
        self._products.pop(sku, None)

    def all_skus(self) -> list[str]:
        return sorted(self._products)


# REFACTOR: Remove Middle Man. The pure delegation methods are removed; clients
# talk to ProductRepository. The only real logic (applying a discount) is kept as a
# domain function that receives the repository.
def apply_discount(repository: ProductRepository, sku: str, pct: float) -> None:
    price = repository.find(sku)
    if price is not None:
        repository.save(sku, round(price * (1 - pct / 100), 2))
