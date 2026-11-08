"""Discount coupon management."""

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

    # REFACTOR: Separate Query from Modifier + Rename Method. `is_valid` now only asks;
    # `redeem` consumes a use and says so in its name.
    def is_valid(self, code: str, today: date) -> bool:
        coupon = self._coupons.get(code)
        return coupon is not None and coupon.expires_on >= today and coupon.uses_left > 0

    def redeem(self, code: str, today: date) -> bool:
        if not self.is_valid(code, today):
            return False
        self._coupons[code].uses_left -= 1
        return True

    # REFACTOR: the name describes what it returns; for the codes, there is another method.
    def get_coupons(self) -> list[Coupon]:
        return list(self._coupons.values())

    def get_codes(self) -> list[str]:
        return list(self._coupons)
