"""Refactored version: the parallel hierarchy is folded into the main one."""

from dataclasses import dataclass
from typing import ClassVar


# REFACTOR: Move Method + Collapse Hierarchy. The instances of one hierarchy
# (Vehicle) absorb the behaviour of the other (CostCalculator). Since only the data
# changes (fixed fee and per-km rate), class attributes are enough.
@dataclass(frozen=True)
class Vehicle:
    plate: str
    base_fee: ClassVar[float]
    per_km: ClassVar[float]

    def cost(self, km: float) -> float:
        return round(self.base_fee + km * self.per_km, 2)


class Van(Vehicle):
    base_fee, per_km = 10, 0.35


class Bike(Vehicle):
    base_fee, per_km = 3, 0.10


class Truck(Vehicle):
    base_fee, per_km = 40, 0.90


def delivery_cost(vehicle: Vehicle, km: float) -> float:
    # REFACTOR: no more map to maintain: a new vehicle is a single class.
    return vehicle.cost(km)
