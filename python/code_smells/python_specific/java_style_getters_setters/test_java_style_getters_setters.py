import pytest

from . import refactored, smelly


def test_same_behavior() -> None:
    old = smelly.Book("Hopscotch", 20.0)
    new = refactored.Book("Hopscotch", 20.0)
    old.set_title("Fictions")
    new.title = "Fictions"
    old.set_price(18.5)
    new.price = 18.5
    assert old.get_title() == new.title == "Fictions"
    assert old.get_price_with_vat() == new.price_with_vat == 19.24


def test_validation_is_kept() -> None:
    with pytest.raises(ValueError):
        smelly.Book("X", 1).set_price(-1)
    with pytest.raises(ValueError):
        refactored.Book("X", 1).price = -1
    with pytest.raises(ValueError):
        refactored.Book("X", -5)
