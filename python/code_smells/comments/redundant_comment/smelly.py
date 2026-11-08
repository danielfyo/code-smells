"""Shopping cart (smelly version)."""

from dataclasses import dataclass, field

# SMELL: Redundant Comment. Every one of these comments repeats what the code already
# says perfectly clearly. They add no information, double the maintenance and train the
# reader to ignore comments (including the important ones).


# Cart class.
@dataclass
class Cart:
    # List of lines.
    lines: list[tuple[str, float, int]] = field(default_factory=list)

    # Adds a product to the cart.
    def add(self, sku: str, unit_price: float, quantity: int = 1) -> None:
        # If the quantity is less than or equal to zero...
        if quantity <= 0:
            # ...we raise ValueError.
            raise ValueError("quantity must be positive")
        # Append the line to the list of lines.
        self.lines.append((sku, unit_price, quantity))

    # Returns the total.
    def total(self) -> float:
        # Initialize the total to zero.
        total = 0.0
        # Loop over the lines.
        for _sku, unit_price, quantity in self.lines:
            # Add price times quantity to the total.
            total += unit_price * quantity
        # Return the total rounded to 2 decimals.
        return round(total, 2)

    # Returns the number of units.
    def item_count(self) -> int:
        # Sum of quantities.
        return sum(quantity for _sku, _price, quantity in self.lines)
