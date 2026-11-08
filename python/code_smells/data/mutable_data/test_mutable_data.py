"""Same discounted prices; the smelly version corrupts the original list."""

import pytest

from code_smells.data.mutable_data import refactored, smelly


def test_same_discounted_quote() -> None:
    old = smelly.PriceList({"TV": 500.0}).apply_black_friday()
    new = refactored.PriceList({"TV": 500.0}).apply_black_friday()
    assert smelly.quote(old, "TV", 2) == refactored.quote(new, "TV", 2) == 700.0


def test_smelly_mutates_shared_data() -> None:
    catalogue = {"TV": 500.0}
    regular = smelly.PriceList(catalogue)
    regular.apply_black_friday()
    assert smelly.quote(regular, "TV", 1) == 350.0  # the regular price changed too!
    assert catalogue["TV"] == 350.0


def test_refactored_keeps_original_intact() -> None:
    catalogue = {"TV": 500.0}
    regular = refactored.PriceList(catalogue)
    regular.apply_black_friday()
    assert refactored.quote(regular, "TV", 1) == 500.0
    with pytest.raises(TypeError):
        regular.prices["TV"] = 1.0  # type: ignore[index]
