"""Same label and same zone with loose fields or with Address."""

import pytest

from code_smells.bloaters.data_clumps import refactored, smelly


@pytest.mark.parametrize(
    ("cp", "zone"), [("28001", "LOCAL"), ("07001", "ISLANDS"), ("48001", "NATIONAL")]
)
def test_same_label_and_zone(cp: str, zone: str) -> None:
    old = smelly.Customer("Ana", "Main Street 1", "Springfield", cp)
    new = refactored.Customer("Ana", refactored.Address("Main Street 1", "Springfield", cp))
    assert smelly.label_for(old) == refactored.label_for(new)
    assert smelly.zone_for(old) == refactored.zone_for(new) == zone
