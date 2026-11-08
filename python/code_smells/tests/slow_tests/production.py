"""Code under test: currency converter that gets the exchange rate from a provider."""

import time
from typing import ClassVar, Protocol


class RateProvider(Protocol):
    def rate(self, source: str, target: str) -> float: ...


class RemoteRateProvider:
    """Simulates a slow remote service (network latency)."""

    LATENCY_SECONDS = 0.05
    _RATES: ClassVar[dict[tuple[str, str], float]] = {("EUR", "USD"): 1.08, ("EUR", "GBP"): 0.85}

    def rate(self, source: str, target: str) -> float:
        time.sleep(self.LATENCY_SECONDS)  # in real life: an HTTP request
        return self._RATES[(source, target)]


class CurrencyConverter:
    def __init__(self, provider: RateProvider) -> None:
        self._provider = provider

    def convert(self, amount: float, source: str, target: str) -> float:
        if source == target:
            return round(amount, 2)
        return round(amount * self._provider.rate(source, target), 2)
