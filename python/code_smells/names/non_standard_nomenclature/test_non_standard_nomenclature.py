from . import refactored, smelly

PRICES = {"TSHIRT-M": 15.0, "MUG": 8.5}


def test_same_behavior() -> None:
    old = smelly.ProductListMaker.DoIt(PRICES)
    new = refactored.ProductCatalog.from_prices(PRICES)
    assert old.getLength() == len(new) == 2
    assert old.hasItem("MUG") and "MUG" in new
    assert not old.hasItem("HAT") and "HAT" not in new
