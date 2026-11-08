"""Parking rates by vehicle type."""

from enum import Enum


# REFACTOR: Replace Type Code with Enum + Move Data into the Type. The rate is part of each
# type's definition: it is impossible to add a vehicle without saying how much it pays. The
# structure enforces the rule; there is nothing left to remember.
class VehicleType(Enum):
    CAR = ("car", 2.0)
    MOTORBIKE = ("motorbike", 0.8)
    VAN = ("van", 3.5)
    ELECTRIC = ("electric", 1.0)

    def __init__(self, code: str, hourly_rate: float) -> None:
        self.code = code
        self.hourly_rate = hourly_rate

    @classmethod
    def from_code(cls, code: str) -> "VehicleType":
        for vehicle in cls:
            if vehicle.code == code:
                return vehicle
        raise ValueError(f"Unknown vehicle type: {code!r}")


VEHICLE_TYPES = [vehicle.code for vehicle in VehicleType]


def hourly_rate(vehicle_type: str) -> float:
    return VehicleType.from_code(vehicle_type).hourly_rate


def parking_fee(vehicle_type: str, hours: int) -> float:
    return hourly_rate(vehicle_type) * hours
