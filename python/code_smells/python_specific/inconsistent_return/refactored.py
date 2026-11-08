"""Looking up a parking rate by postal code."""

ZONES = {"28001": "center", "28045": "midtown", "28290": "outskirts"}
RATES = {"center": 3.2, "midtown": 2.1}
FREE_PARKING_RATE = 0.0


class UnknownPostalCode(LookupError):
    pass


# REFACTOR: Make Returns Consistent. Every path explicitly returns a float (zones without a
# rate are free, an explicit business rule) and the truly exceptional case, an unknown
# postal code, raises a meaningful exception.
def hourly_rate(postal_code: str) -> float:
    zone = ZONES.get(postal_code)
    if zone is None:
        raise UnknownPostalCode(postal_code)
    return RATES.get(zone, FREE_PARKING_RATE)


def parking_cost(postal_code: str, hours: float) -> float:
    return round(hourly_rate(postal_code) * hours, 2)
