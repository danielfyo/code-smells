"""Smelly version: shipping rules expressed with negations and double negations."""

from dataclasses import dataclass


@dataclass
class Parcel:
    is_not_fragile: bool
    is_not_international: bool
    weight_kg: float


def shipping_method(parcel: Parcel) -> str:
    # SMELL: Negative Conditionals. Negatively named flags and conditions with `not`
    # on top of them produce double negatives: "if it is not not-fragile...". They are
    # hard to reason about and easy to invert by mistake.
    if not parcel.is_not_fragile:
        return "CAREFUL"
    if not (not parcel.is_not_international):
        if not parcel.weight_kg > 20:
            return "STANDARD"
        else:
            return "FREIGHT"
    else:
        return "CUSTOMS"
