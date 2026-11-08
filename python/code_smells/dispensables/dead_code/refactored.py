"""Refactored version: only the code that is actually used remains."""

import math

# REFACTOR: Remove Dead Code. The legacy constant, the unused parameter, the debug
# variable, the unreachable branch, the orphan function and the commented-out code
# are removed. If they are ever needed again, they are in the git history.
HOURLY_RATE = 2.5
DAILY_CAP = 20.0
RESIDENT_DISCOUNT = 0.5


def parking_fee(minutes: int, is_resident: bool) -> float:
    if minutes <= 0:
        return 0.0
    fee = math.ceil(minutes / 60) * HOURLY_RATE
    if is_resident:
        fee *= RESIDENT_DISCOUNT
    return min(fee, DAILY_CAP)
