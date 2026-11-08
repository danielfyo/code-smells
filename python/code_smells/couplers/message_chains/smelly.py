"""Smelly version: the client navigates the whole structure to get one value."""

from dataclasses import dataclass


@dataclass
class Country:
    code: str
    vat_rate: float


@dataclass
class Address:
    city: str
    country: Country


@dataclass
class Customer:
    name: str
    address: Address


@dataclass
class Booking:
    customer: Customer
    net_price: float


def booking_gross_price(booking: Booking) -> float:
    # SMELL: Message Chains (Train Wreck). booking.customer.address.country.vat_rate
    # couples this function to the whole navigation chain: if Address stops having a
    # Country (or Customer gets several addresses), it breaks here.
    return round(booking.net_price * (1 + booking.customer.address.country.vat_rate), 2)


def booking_country_code(booking: Booking) -> str:
    # SMELL: the same chain repeated in another client.
    return booking.customer.address.country.code
