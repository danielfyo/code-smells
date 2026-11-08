"""Fee calculation by payment type (smelly version)."""


class Payment:
    def __init__(self, amount: float) -> None:
        self.amount = amount


class CardPayment(Payment):
    pass


class PremiumCardPayment(CardPayment):
    """Premium card: it is a card, so it should pay at least the card fee."""


class TransferPayment(Payment):
    pass


# SMELL: Type Checking with type(). `type(x) == Class` ignores inheritance: a
# PremiumCardPayment is not "== CardPayment", so it falls into the default branch and pays
# no fee. On top of that, the if/elif chain grows with every new payment type.
def fee(payment: Payment) -> float:
    if type(payment) == CardPayment:  # noqa: E721
        return round(payment.amount * 0.015, 2)
    elif type(payment) == TransferPayment:  # noqa: E721
        return 0.35
    return 0.0
