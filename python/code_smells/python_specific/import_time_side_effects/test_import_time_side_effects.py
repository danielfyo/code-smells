import importlib

import pytest

from . import fake_db, refactored, smelly


@pytest.fixture
def fresh_counter(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(fake_db, "connections_opened", 0)
    monkeypatch.delenv("SHOP_SHOW_SYMBOL", raising=False)


def test_smelly_connects_on_import(fresh_counter: None) -> None:
    importlib.reload(smelly)
    assert fake_db.connections_opened == 1  # just by importing


def test_refactored_import_is_free(fresh_counter: None) -> None:
    importlib.reload(refactored)
    assert fake_db.connections_opened == 0
    assert refactored.price_in(10, "USD") == "10.8 USD"
    assert refactored.price_in(10, "GBP") == "8.5 GBP"
    assert fake_db.connections_opened == 1  # lazy and reused


def test_same_prices(fresh_counter: None) -> None:
    importlib.reload(smelly)
    assert smelly.price_in(10, "USD") == refactored.price_in(10, "USD")


def test_smelly_config_is_frozen_at_import(
    fresh_counter: None, monkeypatch: pytest.MonkeyPatch
) -> None:
    importlib.reload(smelly)
    monkeypatch.setenv("SHOP_SHOW_SYMBOL", "0")
    assert smelly.price_in(10, "USD") == "10.8 USD"  # ignores the configuration change
    assert refactored.price_in(10, "USD") == "10.8"
