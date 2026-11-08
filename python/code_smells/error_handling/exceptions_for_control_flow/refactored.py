"""Refactored version: expected cases are handled with normal conditions."""


def apply_coupons(cart_total: float, codes: list[str], coupons: dict[str, float]) -> float:
    # REFACTOR: Replace Exception with Precheck (Replace Exception with Test). An
    # unknown coupon simply contributes a 0 discount.
    discount = sum(coupons.get(code, 0.0) for code in codes)
    return max(cart_total - discount, 0.0)


def first_available_slot(slots: list[tuple[str, bool]]) -> str | None:
    # REFACTOR: the loop with early exit is expressed with next(); no exceptions.
    return next((label for label, free in slots if free), None)
