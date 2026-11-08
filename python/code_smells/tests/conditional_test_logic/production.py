"""Code under test: flight search by destination."""

from dataclasses import dataclass


@dataclass(frozen=True)
class Flight:
    code: str
    destination: str
    price: float


FLIGHTS = [
    Flight("IB3170", "LIS", 89.0),
    Flight("TP1023", "LIS", 120.0),
    Flight("VY1234", "BCN", 45.0),
]


def search(destination: str, max_price: float | None = None) -> list[Flight]:
    results = [f for f in FLIGHTS if f.destination == destination]
    if max_price is not None:
        results = [f for f in results if f.price <= max_price]
    return sorted(results, key=lambda f: f.price)
