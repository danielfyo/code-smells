from datetime import date

from . import refactored, smelly

TODAY = date(2026, 5, 1)


def test_smelly_is_valid_consumes_uses() -> None:
    book = smelly.CouponBook([smelly.Coupon("SUMMER", date(2026, 6, 1), 1)])
    assert book.is_valid("SUMMER", TODAY)  # show "valid coupon" on screen...
    assert not book.is_valid("SUMMER", TODAY)  # ...and when applying it, it no longer is!


def test_refactored_is_valid_is_a_pure_query() -> None:
    book = refactored.CouponBook([refactored.Coupon("SUMMER", date(2026, 6, 1), 1)])
    assert book.is_valid("SUMMER", TODAY)
    assert book.is_valid("SUMMER", TODAY)
    assert book.redeem("SUMMER", TODAY)
    assert not book.redeem("SUMMER", TODAY)


def test_expired_coupon() -> None:
    book = refactored.CouponBook([refactored.Coupon("OLD", date(2026, 1, 1), 5)])
    assert not book.is_valid("OLD", TODAY)
    assert book.get_codes() == ["OLD"]
    assert book.get_coupons()[0].code == "OLD"
