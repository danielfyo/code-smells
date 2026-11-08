"""Refactored version: each object offers what its clients need."""

from dataclasses import dataclass


@dataclass(frozen=True)
class Country:
    code: str
    vat_rate: float


@dataclass(frozen=True)
class Address:
    city: str
    country: Country


@dataclass(frozen=True)
class Customer:
    name: str
    address: Address

    # REFACTOR: Hide Delegate. Customer directly exposes what it is asked for.
    @property
    def vat_rate(self) -> float:
        return self.address.country.vat_rate

    @property
    def country_code(self) -> str:
        return self.address.country.code


@dataclass(frozen=True)
class Booking:
    customer: Customer
    net_price: float

    # REFACTOR: Extract Method + Move Method. The calculation lives in Booking and only
    # talks to its immediate neighbour (Law of Demeter).
    @property
    def gross_price(self) -> float:
        return round(self.net_price * (1 + self.customer.vat_rate), 2)


def booking_gross_price(booking: Booking) -> float:
    return booking.gross_price


def booking_country_code(booking: Booking) -> str:
    return booking.customer.country_code
