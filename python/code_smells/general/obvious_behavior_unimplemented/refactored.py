"""Weekday name conversion for a shift rota system."""

from enum import IntEnum


# REFACTOR: Implement Obvious Behavior. An Enum with a lookup that tolerates case, spaces and
# three-letter abbreviations, and an explicit error for unknown names instead of a sentinel
# value that sneaks in as an index.
class Weekday(IntEnum):
    MONDAY = 0
    TUESDAY = 1
    WEDNESDAY = 2
    THURSDAY = 3
    FRIDAY = 4
    SATURDAY = 5
    SUNDAY = 6

    @classmethod
    def from_name(cls, name: str) -> "Weekday":
        normalized = name.strip().upper()
        for day in cls:
            if normalized in (day.name, day.name[:3]):
                return day
        raise ValueError(f"Unknown weekday: {name!r}")


def day_from_name(name: str) -> int:
    return int(Weekday.from_name(name))


def shift_for(name: str, rota: list[str]) -> str:
    return rota[day_from_name(name)]
