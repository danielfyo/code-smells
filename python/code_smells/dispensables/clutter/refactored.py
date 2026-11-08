"""Refactored version: the same cart without the noise."""

from dataclasses import dataclass, field


@dataclass(frozen=True)
class CartItem:
    name: str
    price: float
    quantity: int = 1


# REFACTOR: Remove Dead Code + Inline Variable + Simplify Conditional. Unused imports
# and attributes are removed, @dataclass generates the empty constructor and
# index-based loops are replaced by direct expressions.
@dataclass
class ShoppingCart:
    items: list[CartItem] = field(default_factory=list)

    def add_item(self, name: str, price: float, quantity: int = 1) -> None:
        self.items.append(CartItem(name, price, quantity))

    def get_total(self) -> float:
        return sum(i.price * i.quantity for i in self.items)

    def is_empty(self) -> bool:
        return not self.items
