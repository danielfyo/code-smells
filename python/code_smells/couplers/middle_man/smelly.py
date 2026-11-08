"""Smelly version: a catalogue "manager" that only forwards calls to the repository."""


class ProductRepository:
    def __init__(self) -> None:
        self._products: dict[str, float] = {}

    def save(self, sku: str, price: float) -> None:
        self._products[sku] = price

    def find(self, sku: str) -> float | None:
        return self._products.get(sku)

    def delete(self, sku: str) -> None:
        self._products.pop(sku, None)

    def all_skus(self) -> list[str]:
        return sorted(self._products)


class CatalogManager:
    # SMELL: Middle Man. Every method just delegates to the repository without
    # adding any logic. It is an extra layer that must be maintained in parallel
    # every time the repository gains a method.
    def __init__(self, repository: ProductRepository) -> None:
        self._repository = repository

    def save(self, sku: str, price: float) -> None:
        self._repository.save(sku, price)

    def find(self, sku: str) -> float | None:
        return self._repository.find(sku)

    def delete(self, sku: str) -> None:
        self._repository.delete(sku)

    def all_skus(self) -> list[str]:
        return self._repository.all_skus()

    def apply_discount(self, sku: str, pct: float) -> None:
        # The only method with logic of its own.
        price = self._repository.find(sku)
        if price is not None:
            self._repository.save(sku, round(price * (1 - pct / 100), 2))
