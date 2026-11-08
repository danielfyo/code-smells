"""Smelly version: manual loops to filter, transform and group shipments."""


def delayed_tracking_codes(shipments: list[dict]) -> list[str]:
    # SMELL: Loops. A loop with an accumulator for what is a simple filter + map.
    result = []
    for s in shipments:
        if s["status"] == "DELAYED":
            result.append(s["tracking"].upper())
    result.sort()
    return result


def weight_by_carrier(shipments: list[dict]) -> dict[str, float]:
    # SMELL: grouping by hand, key check included.
    totals = {}
    for s in shipments:
        if s["carrier"] not in totals:
            totals[s["carrier"]] = 0.0
        totals[s["carrier"]] = totals[s["carrier"]] + s["weight"]
    return totals


def heaviest(shipments: list[dict]) -> str | None:
    # SMELL: searching for the maximum with helper variables.
    best = None
    best_weight = -1.0
    for s in shipments:
        if s["weight"] > best_weight:
            best_weight = s["weight"]
            best = s["tracking"]
    return best
