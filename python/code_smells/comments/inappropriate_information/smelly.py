"""Parcel shipping rate calculation (smelly version)."""

# SMELL: Inappropriate Information. This header is a hand-written change log: author,
# dates and tickets belong in version control and the issue tracker, not in the source
# code. Nobody maintains it, so it ends up as noise or as a lie.
# ---------------------------------------------------------------------------
# Author: J. Perez (jperez@company.local)
# Created: 2019-02-03
# Modified: 2020-06-11 - M. Gomez - added islands surcharge (TICKET-4821)
# Modified: 2022-01-27 - J. Perez - new rates after the fuel price increase
# Modified: 2023-09-14 - L. Ruiz  - reviewed in the meeting with logistics
# Reviewed by: Architecture committee (minutes 2023-17)
# ---------------------------------------------------------------------------

BASE_RATE = 4.5
RATE_PER_KG = 1.2
ISLANDS_SURCHARGE = 6.0


def shipping_cost(weight_kg: float, to_islands: bool) -> float:
    # SMELL: more process metadata (who asked for what and when) instead of explaining
    # *why* the business rule exists.
    # TICKET-4821: Martha from logistics asked for this by email on 2020-06-10, see "Re: islands"
    cost = BASE_RATE + weight_kg * RATE_PER_KG
    if to_islands:
        cost += ISLANDS_SURCHARGE
    return round(cost, 2)
