"""Smelly version: a ticket queue whose "query" also modifies it."""


class TicketQueue:
    def __init__(self) -> None:
        self._tickets: list[str] = []

    def add(self, ticket: str) -> int:
        # SMELL: Command-Query Separation Violation. A command that also returns
        # information (the size). Is it returning the id? The size before or
        # after? The ambiguity invites mistakes.
        self._tickets.append(ticket)
        return len(self._tickets)

    def next_ticket(self) -> str | None:
        # SMELL: it looks like a query ("which one is next?") but it removes it from
        # the queue. Calling it twice just to "peek" loses tickets.
        return self._tickets.pop(0) if self._tickets else None

    def pending(self) -> int:
        return len(self._tickets)
