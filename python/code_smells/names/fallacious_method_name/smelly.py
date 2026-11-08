"""Discount coupon management (smelly version)."""

from dataclasses import dataclass
from datetime import date


@dataclass
class Coupon:
    code: str
    expires_on: date
    uses_left: int


class CouponBook:
    def __init__(self, coupons: list[Coupon]) -> None:
        self._coupons = {c.code: c for c in coupons}

    # SMELL: Fallacious Method Name. `is_valid` promises an innocent question, but it also
    # CONSUMES one use of the coupon. Calling it twice (e.g. to display and then to apply)
    # spends two uses.
    def is_valid(self, code: str, today: date) -> bool:
        coupon = self._coupons.get(code)
        if coupon is None or coupon.expires_on < today or coupon.uses_left <= 0:
            return False
        coupon.uses_left -= 1
        return True

    # SMELL: `get_discount_codes` promises the codes but returns the Coupon objects.
    def get_discount_codes(self) -> list[Coupon]:
        return list(self._coupons.values())
