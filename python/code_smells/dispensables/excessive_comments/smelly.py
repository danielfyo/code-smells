"""Smelly version: comments covering up confusing code about library loans."""

from datetime import date


def calc(l: dict, d: date) -> float:
    # SMELL: Comments (as deodorant). One comment per line is needed because the
    # names say nothing. The comments try to mask the bad smell instead of removing
    # it; they can also drift out of sync with the code.

    # compute the days elapsed since the expected return date
    x = (d - l["due"]).days
    # if it is not late, there is no fine
    if x <= 0:
        return 0.0
    # if the member is premium (type 2) the fine is half
    r = 0.25 if l["t"] == 2 else 0.5
    # multiply days by rate and cap at 10 euros maximum (or the book price
    # if it is lower)
    return min(x * r, 10.0, l["p"])
