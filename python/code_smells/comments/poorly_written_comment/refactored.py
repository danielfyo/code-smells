"""Hotel booking cancellation fee calculation."""

from datetime import date

# REFACTOR: Rewrite Comment + Introduce Named Constants. The confusing comment is replaced
# by a precise docstring describing the policy, and the magic numbers become named
# constants. Open questions ("ask bookings") get resolved, not commented.
FREE_CANCELLATION_DAYS = 7
PARTIAL_REFUND_DAYS = 2
PARTIAL_FEE_RATE = 0.5


def cancellation_fee(booking_total: float, check_in: date, cancelled_on: date) -> float:
    """Cancellation fee in euros depending on how early the booking is cancelled.

    - 7 or more days before check-in: free.
    - Between 2 and 6 days before: 50 % of the total is charged.
    - Less than 2 days before: the full total is charged.
    """
    days_before = (check_in - cancelled_on).days
    if days_before >= FREE_CANCELLATION_DAYS:
        return 0.0
    if days_before >= PARTIAL_REFUND_DAYS:
        return round(booking_total * PARTIAL_FEE_RATE, 2)
    return round(booking_total, 2)
