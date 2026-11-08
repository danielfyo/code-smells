"""Refactored version: the data clump becomes the Address object."""

from dataclasses import dataclass
from enum import Enum


class Zone(str, Enum):
    LOCAL = "LOCAL"
    ISLANDS = "ISLANDS"
    NATIONAL = "NATIONAL"


# REFACTOR: Extract Class + Introduce Parameter Object. The three fields become a
# single type, which also attracts the behaviour that depends only on them.
@dataclass(frozen=True)
class Address:
    street: str
    city: str
    postal_code: str

    # REFACTOR: Move Method. The zone depends on the address, so it lives in the address.
    @property
    def zone(self) -> Zone:
        if self.postal_code.startswith("28"):
            return Zone.LOCAL
        if self.postal_code.startswith(("07", "35", "38")):
            return Zone.ISLANDS
        return Zone.NATIONAL

    def lines(self) -> list[str]:
        return [self.street, f"{self.postal_code} {self.city}"]


@dataclass(frozen=True)
class Customer:
    name: str
    address: Address


def label_for(customer: Customer) -> str:
    return "\n".join([customer.name, *customer.address.lines()])


def zone_for(customer: Customer) -> str:
    return customer.address.zone.value
