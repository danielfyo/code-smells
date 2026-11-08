"""Splitting a restaurant bill among diners."""

from decimal import ROUND_HALF_UP, Decimal

CENT = Decimal("0.01")


# REFACTOR: Replace float with Decimal (or integer cents) + exact split. The work is done in
# integer cents and the remainder of the division goes to the first diners, so the sum of
# the shares is always exactly the total.
def split_bill(total: Decimal, diners: int) -> list[Decimal]:
    if diners <= 0:
        raise ValueError("diners must be positive")
    total_cents = int((total / CENT).to_integral_value(ROUND_HALF_UP))
    base, remainder = divmod(total_cents, diners)
    return [Decimal(base + (1 if i < remainder else 0)) * CENT for i in range(diners)]


def add_tip(total: Decimal, tip_rate: Decimal) -> Decimal:
    return (total * (1 + tip_rate)).quantize(CENT, rounding=ROUND_HALF_UP)
