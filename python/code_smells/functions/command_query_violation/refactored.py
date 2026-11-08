"""Refactored version: commands that change state and queries that do not."""

from collections import deque
from dataclasses import dataclass, field


@dataclass
class TicketQueue:
    _tickets: deque[str] = field(default_factory=deque)

    # REFACTOR: Separate Query from Modifier. Commands return nothing...
    def add(self, ticket: str) -> None:
        self._tickets.append(ticket)

    def take_next(self) -> None:
        if not self._tickets:
            raise LookupError("No pending tickets")
        self._tickets.popleft()

    # ...and queries do not alter state: they can be called as many times as needed.
    def peek(self) -> str | None:
        return self._tickets[0] if self._tickets else None

    def pending(self) -> int:
        return len(self._tickets)
