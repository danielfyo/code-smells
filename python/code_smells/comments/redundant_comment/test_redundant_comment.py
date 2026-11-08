import pytest

from . import refactored, smelly


@pytest.mark.parametrize("module", [smelly, refactored])
def test_cart_totals(module) -> None:
    cart = module.Cart()
    cart.add("BOOK-1", 12.99, 2)
    cart.add("PEN-7", 1.10)
    assert cart.total() == 27.08
    assert cart.item_count() == 3


@pytest.mark.parametrize("module", [smelly, refactored])
def test_rejects_non_positive_quantity(module) -> None:
    with pytest.raises(ValueError):
        module.Cart().add("BOOK-1", 12.99, 0)
