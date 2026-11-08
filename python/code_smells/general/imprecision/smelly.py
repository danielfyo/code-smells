"""Splitting a restaurant bill among diners (smelly version)."""


# SMELL: Imprecision. Float is used for money (0.1 + 0.2 != 0.3) and the bill is split by
# dividing and rounding each share, so the sum of the shares does not match the total:
# cents disappear or appear out of nowhere.
def split_bill(total: float, diners: int) -> list[float]:
    share = round(total / diners, 2)
    return [share] * diners


def add_tip(total: float, tip_rate: float) -> float:
    return total + total * tip_rate
