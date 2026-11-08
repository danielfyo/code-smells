"""Results of a fun run."""


# REFACTOR: Iterate Directly / use zip + enumerate. `zip` pairs runner and time, `sorted` +
# slicing picks the podium and `enumerate(start=1)` numbers the positions.
def podium(runners: list[str], times: list[float]) -> list[str]:
    ranking = sorted(zip(times, runners, strict=True))
    return [
        f"{position}. {runner} ({time:.1f} min)"
        for position, (time, runner) in enumerate(ranking[:3], start=1)
    ]
