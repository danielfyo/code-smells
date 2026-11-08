"""Refactored version: positive names and conditions."""

from dataclasses import dataclass

HEAVY_PARCEL_KG = 20


@dataclass(frozen=True)
class Parcel:
    # REFACTOR: Rename Field. Flags with a positive meaning.
    is_fragile: bool
    is_international: bool
    weight_kg: float

    @property
    def is_heavy(self) -> bool:
        return self.weight_kg > HEAVY_PARCEL_KG


def shipping_method(parcel: Parcel) -> str:
    # REFACTOR: Invert Condition + Guard Clauses. Each condition reads in the positive.
    if parcel.is_fragile:
        return "CAREFUL"
    if parcel.is_international:
        return "CUSTOMS"
    if parcel.is_heavy:
        return "FREIGHT"
    return "STANDARD"
