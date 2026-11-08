"""Product in a bookshop catalog (smelly version)."""


# SMELL: Java-style Getters/Setters. Trivial get_x/set_x methods that only read and write an
# attribute. In Python they add noise and verbosity without real encapsulation: if logic is
# ever needed, `@property` allows adding it without changing the interface.
class Book:
    def __init__(self, title: str, price: float) -> None:
        self._title = title
        self._price = price

    def get_title(self) -> str:
        return self._title

    def set_title(self, title: str) -> None:
        self._title = title

    def get_price(self) -> float:
        return self._price

    def set_price(self, price: float) -> None:
        if price < 0:
            raise ValueError("price cannot be negative")
        self._price = price

    def get_price_with_vat(self) -> float:
        return round(self.get_price() * 1.04, 2)
