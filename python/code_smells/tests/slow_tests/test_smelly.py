"""Smelly tests: Slow Tests."""

from .production import CurrencyConverter, RemoteRateProvider


# SMELL: Slow Tests. Every test uses the real "remote" provider, which pays network latency
# (simulated here with 50 ms; in real life, hundreds of ms and intermittent failures). With
# hundreds of tests like this, the suite takes minutes and people stop running it.
def test_eur_to_usd() -> None:
    assert CurrencyConverter(RemoteRateProvider()).convert(100, "EUR", "USD") == 108.0


def test_eur_to_gbp() -> None:
    assert CurrencyConverter(RemoteRateProvider()).convert(100, "EUR", "GBP") == 85.0


def test_rounding() -> None:
    assert CurrencyConverter(RemoteRateProvider()).convert(9.99, "EUR", "USD") == 10.79
