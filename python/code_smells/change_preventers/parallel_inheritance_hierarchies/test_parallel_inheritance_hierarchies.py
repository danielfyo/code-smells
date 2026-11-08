"""Same costs with a single hierarchy."""

import pytest

from code_smells.change_preventers.parallel_inheritance_hierarchies import refactored, smelly


@pytest.mark.parametrize("name", ["Van", "Bike", "Truck"])
@pytest.mark.parametrize("km", [0, 12.5, 230])
def test_same_cost(name: str, km: float) -> None:
    old = smelly.delivery_cost(getattr(smelly, name)("1234-ABC"), km)
    new = refactored.delivery_cost(getattr(refactored, name)("1234-ABC"), km)
    assert old == new


def test_new_vehicle_needs_one_class() -> None:
    class Drone(refactored.Vehicle):
        base_fee, per_km = 15, 1.5

    assert refactored.delivery_cost(Drone("D-1"), 2) == 18.0

    class SmellyDrone(smelly.Vehicle):  # type: ignore[misc]  # smelly is not type-checked
        pass

    with pytest.raises(KeyError):  # we forgot to create and register its twin
        smelly.delivery_cost(SmellyDrone("D-1"), 2)
