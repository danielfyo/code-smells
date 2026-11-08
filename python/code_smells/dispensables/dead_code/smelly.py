"""Smelly version: parking fee calculation full of code that never runs."""

LEGACY_RATE = 1.75  # SMELL: Dead Code. A constant nobody uses anymore.


def parking_fee(minutes: int, is_resident: bool, legacy_mode: bool = False) -> float:
    # SMELL: the `legacy_mode` parameter is never set to True anywhere.
    debug_info = f"computing {minutes}"  # SMELL: variable assigned and never read.
    if minutes <= 0:
        return 0.0
    if legacy_mode:
        # SMELL: branch unreachable in practice.
        return round(minutes / 60 * LEGACY_RATE, 2)
    hours = -(-minutes // 60)  # round up
    fee = hours * 2.5
    if is_resident:
        fee *= 0.5
    return min(fee, 20.0)
    print("fee computed")  # SMELL: statement after a return: it never runs.


def _old_weekend_fee(minutes: int) -> float:
    # SMELL: private function nobody calls; it was left "just in case".
    return minutes * 0.05


# def night_fee(minutes):
#     return minutes * 0.01
# SMELL: commented-out code; version control already keeps the history.
