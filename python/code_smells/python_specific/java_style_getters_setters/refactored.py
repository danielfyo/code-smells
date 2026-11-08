"""Product in a bookshop catalog."""


# REFACTOR: Replace Getters/Setters with Attributes and @property. The title is a plain
# public attribute; the price uses `@property` because it has validation; the VAT-inclusive
# price is a read-only computed property.
class Book:
    def __init__(self, title: str, price: float) -> None:
        self.title = title
        self.price = price  # goes through the setter: also validates on construction

    @property
    def price(self) -> float:
        return self._price

    @price.setter
    def price(self, value: float) -> None:
        if value < 0:
            raise ValueError("price cannot be negative")
        self._price = value

    @property
    def price_with_vat(self) -> float:
        return round(self.price * 1.04, 2)
