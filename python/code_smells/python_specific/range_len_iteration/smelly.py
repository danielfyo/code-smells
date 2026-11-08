"""Results of a fun run (smelly version)."""


# SMELL: Range-Len Iteration. The code iterates by index with `range(len(...))` and accesses
# each list with `[i]`, C-style. It is more verbose, prone to off-by-one errors and hides
# the intent (walk runner/time pairs, number the positions).
def podium(runners: list[str], times: list[float]) -> list[str]:
    pairs = []
    for i in range(len(runners)):
        pairs.append((times[i], runners[i]))
    pairs.sort()
    result = []
    for i in range(len(pairs)):
        if i >= 3:
            break
        result.append(f"{i + 1}. {pairs[i][1]} ({pairs[i][0]:.1f} min)")
    return result
