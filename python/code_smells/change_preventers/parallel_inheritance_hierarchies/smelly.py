"""Smelly version: each delivery vehicle type requires its twin "calculator"."""


class Vehicle:
    def __init__(self, plate: str) -> None:
        self.plate = plate


class Van(Vehicle):
    pass


class Bike(Vehicle):
    pass


class Truck(Vehicle):
    pass


# SMELL: Parallel Inheritance Hierarchies. For every Vehicle subclass there is a twin
# CostCalculator subclass. Adding "Drone" forces you to create DroneCostCalculator
# and register it in the map: two hierarchies that always grow together.
class CostCalculator:
    def cost(self, km: float) -> float:
        raise NotImplementedError


class VanCostCalculator(CostCalculator):
    def cost(self, km: float) -> float:
        return 10 + km * 0.35


class BikeCostCalculator(CostCalculator):
    def cost(self, km: float) -> float:
        return 3 + km * 0.10


class TruckCostCalculator(CostCalculator):
    def cost(self, km: float) -> float:
        return 40 + km * 0.90


# SMELL: the pairing between hierarchies is maintained by hand.
CALCULATORS: dict[type[Vehicle], CostCalculator] = {
    Van: VanCostCalculator(),
    Bike: BikeCostCalculator(),
    Truck: TruckCostCalculator(),
}


def delivery_cost(vehicle: Vehicle, km: float) -> float:
    return round(CALCULATORS[type(vehicle)].cost(km), 2)
