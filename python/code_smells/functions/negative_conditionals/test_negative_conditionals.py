"""The positive conditions decide the same as the negative ones."""

from itertools import product

import pytest

from code_smells.functions.negative_conditionals import refactored, smelly


@pytest.mark.parametrize("fragile,international,weight", list(product([True, False], [True, False], [5, 20, 25])))
def test_same_method(fragile: bool, international: bool, weight: float) -> None:
    old = smelly.Parcel(is_not_fragile=not fragile, is_not_international=not international, weight_kg=weight)
    new = refactored.Parcel(is_fragile=fragile, is_international=international, weight_kg=weight)
    assert smelly.shipping_method(old) == refactored.shipping_method(new)
