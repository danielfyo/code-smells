"""Clean tests: fast and deterministic thanks to a test double."""

import pytest

from .production import CurrencyConverter


# REFACTOR: Replace Slow Dependency with Test Double. An in-memory provider (fake) that
# answers instantly is injected. Integration tests against the real service, if any, are
# marked separately (e.g. `@pytest.mark.integration`) and run in CI.
class FakeRateProvider:
    def __init__(self, rates: dict[tuple[str, str], float]) -> None:
        self._rates = rates

    def rate(self, source: str, target: str) -> float:
        return self._rates[(source, target)]


@pytest.fixture
def converter() -> CurrencyConverter:
    return CurrencyConverter(FakeRateProvider({("EUR", "USD"): 1.08, ("EUR", "GBP"): 0.85}))


@pytest.mark.parametrize(
    ("amount", "target", "expected"),
    [(100, "USD", 108.0), (100, "GBP", 85.0), (9.99, "USD", 10.79)],
)
def test_convert(converter: CurrencyConverter, amount: float, target: str, expected: float) -> None:
    assert converter.convert(amount, "EUR", target) == expected


def test_same_currency_does_not_call_provider() -> None:
    assert CurrencyConverter(FakeRateProvider({})).convert(10.005, "EUR", "EUR") == 10.01
