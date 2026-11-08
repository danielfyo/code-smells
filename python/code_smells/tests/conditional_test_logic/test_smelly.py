"""Smelly tests: Conditional Test Logic."""

from .production import search


# SMELL: Conditional Test Logic. The test contains `if`, loops and `try/except`. If `search`
# returned an empty list, the loop would not run and the test would pass without checking
# anything; the `except` swallows any failure. A test that may not run its assertions
# protects against nothing.
def test_search_lisbon_under_100() -> None:
    results = search("LIS", max_price=100)
    if results:
        for flight in results:
            assert flight.destination == "LIS"
            assert flight.price <= 100


def test_search_sorted() -> None:
    try:
        results = search("LIS")
        for i in range(len(results) - 1):
            assert results[i].price <= results[i + 1].price
    except Exception:  # noqa: BLE001, S110 (this is exactly the smell)
        pass
