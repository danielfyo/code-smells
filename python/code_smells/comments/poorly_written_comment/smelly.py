"""Hotel booking cancellation fee calculation (smelly version)."""

from datetime import date


def cancellation_fee(booking_total: float, check_in: date, cancelled_on: date) -> float:
    # SMELL: Poorly Written Comment. Vague, rambling and full of typos: "before" what?
    # "half" of what? Does "the weekend thing" apply or not? It confuses more than it helps.
    # here we do the cancelation stuff, if they cancel early its free i think
    # (or was it 7 days?? ask bookings) and if not then half or everything it depends,
    # careful the weekend thing idk if its still a thing, dont touch it works!!!
    days_before = (check_in - cancelled_on).days
    if days_before >= 7:
        return 0.0
    # SMELL: "bc yes" explains nothing and "the 2" is ambiguous (days? euros? nights?).
    # this bc yes, the 2 is what they said
    if days_before >= 2:
        return round(booking_total * 0.5, 2)
    return round(booking_total, 2)
