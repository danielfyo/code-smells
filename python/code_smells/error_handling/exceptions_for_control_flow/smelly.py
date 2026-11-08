"""Smelly version: exceptions are used for perfectly expected cases."""


def apply_coupons(cart_total: float, codes: list[str], coupons: dict[str, float]) -> float:
    total = cart_total
    for code in codes:
        # SMELL: Exceptions for Control Flow. A coupon not existing is normal (the
        # user makes a typo), not an exceptional situation. Using KeyError as an
        # "if" hides the intent and is slower.
        try:
            total -= coupons[code]
        except KeyError:
            continue
    return max(total, 0.0)


def first_available_slot(slots: list[tuple[str, bool]]) -> str | None:
    # SMELL: a custom exception is raised just to break out of a loop.
    class Found(Exception):
        pass

    try:
        for label, free in slots:
            if free:
                raise Found(label)
    except Found as found:
        return str(found)
    return None
