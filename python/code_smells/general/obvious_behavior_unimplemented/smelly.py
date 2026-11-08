"""Weekday name conversion for a shift rota system (smelly version)."""

# SMELL: Obvious Behavior Unimplemented (principle of least surprise). Anyone would expect
# `day_from_name` to accept "monday", "Monday" or "MONDAY" (and maybe "mon"), and an unknown
# name to raise an error. Instead it only accepts the exact form and silently returns -1,
# which the caller then uses as a valid index (the last element!).
DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]


def day_from_name(name: str) -> int:
    if name in DAYS:
        return DAYS.index(name)
    return -1


def shift_for(name: str, rota: list[str]) -> str:
    return rota[day_from_name(name)]
