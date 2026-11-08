"""Code under test: meeting room booking registry."""


class RoomBookings:
    def __init__(self) -> None:
        self._bookings: dict[tuple[str, str], str] = {}

    def book(self, room: str, slot: str, person: str) -> None:
        if (room, slot) in self._bookings:
            raise ValueError(f"{room} is already booked at {slot}")
        self._bookings[(room, slot)] = person

    def cancel(self, room: str, slot: str) -> None:
        del self._bookings[(room, slot)]

    def owner(self, room: str, slot: str) -> str | None:
        return self._bookings.get((room, slot))

    def count(self) -> int:
        return len(self._bookings)
