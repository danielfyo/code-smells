"""Looking up a parking rate by postal code (smelly version)."""

ZONES = {"28001": "center", "28045": "midtown", "28290": "outskirts"}
RATES = {"center": 3.2, "midtown": 2.1}


# SMELL: Inconsistent Return. Some branches return a float and others end without a
# `return`, implicitly returning `None`. The caller does not know what to expect: here
# `hourly_rate` returns None both for an unknown postal code and for a zone without a rate,
# and the later calculation blows up with a TypeError far from the cause.
def hourly_rate(postal_code: str):  # type: ignore[no-untyped-def]
    zone = ZONES.get(postal_code)
    if zone is None:
        return
    if zone in RATES:
        return RATES[zone]


def parking_cost(postal_code: str, hours: float) -> float:
    return round(hourly_rate(postal_code) * hours, 2)
