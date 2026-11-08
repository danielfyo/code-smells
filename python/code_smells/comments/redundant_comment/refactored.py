"""Shopping cart."""

from dataclasses import dataclass, field

# REFACTOR: Remove Redundant Comment. Comments that paraphrased the code are gone; good
# names (Cart, add, total, item_count) already tell the story. Only a docstring that adds
# non-obvious information (the rounding) is kept.


@dataclass
class Cart:
    lines: list[tuple[str, float, int]] = field(default_factory=list)

    def add(self, sku: str, unit_price: float, quantity: int = 1) -> None:
        if quantity <= 0:
            raise ValueError("quantity must be positive")
        self.lines.append((sku, unit_price, quantity))

    def total(self) -> float:
        """Total amount rounded to cents."""
        return round(sum(price * qty for _sku, price, qty in self.lines), 2)

    def item_count(self) -> int:
        return sum(qty for _sku, _price, qty in self.lines)
