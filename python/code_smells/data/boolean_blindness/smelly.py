"""Smelly version: flight bookings with booleans that say nothing at the call site."""


def book_seat(passenger: str, flight: str, window: bool, business: bool, refundable: bool) -> dict:
    # SMELL: Boolean Blindness. At the call site you read
    # book_seat("Ana", "IB123", True, False, True): what is each True/False?
    # It is trivial to swap them by mistake and the interpreter does not notice.
    price = 120.0
    if business:
        price *= 3
    if refundable:
        price += 40
    return {
        "passenger": passenger,
        "flight": flight,
        "seat": "window" if window else "aisle",
        "cabin": "business" if business else "economy",
        "price": price,
    }


def can_change_flight(booking: dict) -> bool:
    # SMELL: the "refundable" boolean got lost along the way; now it has to be inferred.
    return booking["cabin"] == "business" or booking["price"] % 120 != 0
