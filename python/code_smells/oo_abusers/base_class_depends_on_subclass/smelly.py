"""Smelly version: the base class Document knows about its subclasses."""


class Document:
    def __init__(self, number: str, amount: float) -> None:
        self.number = number
        self.amount = amount

    def describe(self) -> str:
        # SMELL: Base Class Depending on Its Derivatives. The base asks about its own
        # subclasses. Every new derived class forces a change in the base (violates
        # Open/Closed) and creates a circular dependency between levels.
        if isinstance(self, Invoice):
            prefix = "FAC"
        elif isinstance(self, CreditNote):
            prefix = "ABO"
        else:
            prefix = "DOC"
        return f"{prefix}-{self.number}: {self.signed_amount():.2f}"

    def signed_amount(self) -> float:
        # SMELL: once again the base deciding for its children.
        if type(self).__name__ == "CreditNote":
            return -self.amount
        return self.amount


class Invoice(Document):
    pass


class CreditNote(Document):
    pass
