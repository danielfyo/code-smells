"""Refactored version: parameters are grouped into meaningful objects."""

from dataclasses import dataclass
from enum import Enum


# REFACTOR: Introduce Parameter Object. Sender/recipient and parcel become types.
@dataclass(frozen=True)
class Party:
    name: str
    city: str

    def __str__(self) -> str:
        return f"{self.name} ({self.city})"


@dataclass(frozen=True)
class Parcel:
    weight_kg: float
    length_cm: float
    width_cm: float
    height_cm: float

    # REFACTOR: Move Method. The billable weight calculation belongs to the parcel.
    @property
    def billable_kg(self) -> float:
        volumetric = self.length_cm * self.width_cm * self.height_cm / 5000
        return max(self.weight_kg, volumetric)


class Service(Enum):
    # REFACTOR: Replace Boolean Parameter with Enum: `Service.EXPRESS` reads better than `True`.
    STANDARD = 1.0
    EXPRESS = 1.5


def create_shipment(sender: Party, recipient: Party, parcel: Parcel,
                    service: Service = Service.STANDARD) -> dict:
    price = (5 + parcel.billable_kg * 1.2) * service.value
    return {
        "from": str(sender),
        "to": str(recipient),
        "billable_kg": round(parcel.billable_kg, 2),
        "price": round(price, 2),
    }
