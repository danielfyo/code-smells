"""Clean tests: no conditional logic, explicit expected results."""

from .production import search


# REFACTOR: Replace Conditional Test Logic with explicit expectations. Each test knows its
# exact expected result and compares it unconditionally; if the list comes back empty or
# unsorted, the test fails.
def test_search_filters_by_destination_and_price() -> None:
    assert [f.code for f in search("LIS", max_price=100)] == ["IB3170"]


def test_search_returns_flights_sorted_by_price() -> None:
    assert [f.code for f in search("LIS")] == ["IB3170", "TP1023"]


def test_search_unknown_destination_returns_empty_list() -> None:
    assert search("NYC") == []
