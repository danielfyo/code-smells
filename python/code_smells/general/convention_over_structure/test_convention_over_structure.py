import pytest

from . import refactored, smelly


@pytest.mark.parametrize("vehicle", ["car", "motorbike", "van"])
def test_same_fee_for_original_types(vehicle: str) -> None:
    assert smelly.parking_fee(vehicle, 3) == refactored.parking_fee(vehicle, 3)


def test_smelly_forgot_the_convention() -> None:
    # Bug caused by the smell: "electric" is charged the default car rate.
    assert smelly.parking_fee("electric", 2) == 4.0


def test_refactored_every_type_has_its_rate() -> None:
    assert refactored.parking_fee("electric", 2) == 2.0
    assert all(refactored.hourly_rate(code) > 0 for code in refactored.VEHICLE_TYPES)
    with pytest.raises(ValueError):
        refactored.hourly_rate("truck")
