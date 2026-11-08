"""Fake database that counts how many connections are opened (example helper)."""

connections_opened = 0


class Connection:
    def __init__(self, dsn: str) -> None:
        self.dsn = dsn

    def fetch_exchange_rate(self, currency: str) -> float:
        return {"USD": 1.08, "GBP": 0.85}[currency]


def connect(dsn: str) -> Connection:
    global connections_opened
    connections_opened += 1
    return Connection(dsn)
