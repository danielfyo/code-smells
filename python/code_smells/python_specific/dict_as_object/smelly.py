"""Booking management for a holiday cottage (smelly version)."""


# SMELL: Dict as Object. The booking travels as a dict with "magic" keys. Nothing prevents a
# misspelled key ("nigths"), a forgotten field or a wrong data type; the editor cannot
# autocomplete and the type checker cannot help. The error surfaces far away, as a KeyError.
def make_booking(guest: str, nights: int, price_per_night: float) -> dict:
    return {"guest": guest, "nights": nights, "price_per_night": price_per_night, "paid": False}


def booking_total(booking: dict) -> float:
    total = booking["nights"] * booking["price_per_night"]
    if booking["nights"] >= 7:
        total *= 0.9
    return round(total, 2)


def mark_paid(booking: dict) -> dict:
    booking["payed"] = True  # SMELL: typo in the key; silently creates a new field.
    return booking
