"""Fee calculation by payment type."""


# REFACTOR: Replace Type Code Check with Polymorphism. Each class knows how to compute its
# fee; subclasses inherit their parent's behavior and can extend it. If the type really had
# to be checked, `isinstance` would be used, since it respects inheritance.
class Payment:
    def __init__(self, amount: float) -> None:
        self.amount = amount

    def fee(self) -> float:
        return 0.0


class CardPayment(Payment):
    RATE = 0.015

    def fee(self) -> float:
        return round(self.amount * self.RATE, 2)


class PremiumCardPayment(CardPayment):
    """Inherits the card fee without repeating code."""


class TransferPayment(Payment):
    def fee(self) -> float:
        return 0.35


def fee(payment: Payment) -> float:
    return payment.fee()
