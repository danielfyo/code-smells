"""Parking rates by vehicle type (smelly version)."""

# SMELL: Convention over Structure. Vehicle types are loose strings and the rate is decided
# with if/elif. The only safeguard is a convention in a comment:
# "REMEMBER: if you add a new type to VEHICLE_TYPES, also add its branch in hourly_rate".
# If someone forgets, the new type falls into the default branch and is silently mischarged.
VEHICLE_TYPES = ["car", "motorbike", "van", "electric"]


def hourly_rate(vehicle_type: str) -> float:
    if vehicle_type == "car":
        return 2.0
    elif vehicle_type == "motorbike":
        return 0.8
    elif vehicle_type == "van":
        return 3.5
    # "electric" was added to VEHICLE_TYPES but someone forgot its branch...
    return 2.0


def parking_fee(vehicle_type: str, hours: int) -> float:
    return hourly_rate(vehicle_type) * hours
