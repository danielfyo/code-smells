"""Smelly version: mutable flags control the search for a free warehouse bin."""


def find_free_bin(bins: list[dict], volume: float) -> str | None:
    # SMELL: Status Variable. `found` and `result` are flags mutated along the way
    # to control the loop; you have to track their value mentally on each iteration.
    found = False
    result = None
    i = 0
    while i < len(bins) and not found:
        b = bins[i]
        if not b["blocked"]:
            if b["capacity"] - b["used"] >= volume:
                found = True
                result = b["code"]
        i += 1
    return result


def all_bins_ok(bins: list[dict]) -> bool:
    # SMELL: another flag that only serves to remember something until the end.
    ok = True
    for b in bins:
        if b["used"] > b["capacity"]:
            ok = False
    return ok
