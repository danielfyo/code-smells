"""Library statistics: overdue loans (smelly version)."""

from datetime import date


# SMELL: Uncommunicative Name. `proc`, `d`, `l`, `tmp`, `x`, `n2` reveal nothing.
# To understand the function you must read every line and rebuild the domain in your head.
def proc(d: list[dict], t: date) -> tuple[int, float]:
    tmp = []
    for x in d:
        if x["r"] is None and x["due"] < t:
            tmp.append(x)
    n2 = 0.0
    for l in tmp:  # SMELL: `l` is also easily mistaken for `1` in many fonts.
        n2 += (t - l["due"]).days * 0.25
    return len(tmp), round(n2, 2)
