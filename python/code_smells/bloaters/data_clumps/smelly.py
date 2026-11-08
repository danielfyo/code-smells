"""Smelly version: street, city and postal code always travel together but loose."""


class Customer:
    # SMELL: Data Clumps. The same three fields (street, city, postal_code) show up
    # in the customer, in function signatures and in storage. If "country" is added
    # tomorrow, every signature has to change.
    def __init__(self, name: str, street: str, city: str, postal_code: str) -> None:
        self.name = name
        self.street = street
        self.city = city
        self.postal_code = postal_code


def format_label(name: str, street: str, city: str, postal_code: str) -> str:
    return f"{name}\n{street}\n{postal_code} {city}"


def shipping_zone(street: str, city: str, postal_code: str) -> str:
    # SMELL: receives street even though it does not use it, just because "they always go together".
    if postal_code.startswith("28"):
        return "LOCAL"
    if postal_code.startswith(("07", "35", "38")):
        return "ISLANDS"
    return "NATIONAL"


def label_for(customer: Customer) -> str:
    return format_label(customer.name, customer.street, customer.city, customer.postal_code)


def zone_for(customer: Customer) -> str:
    return shipping_zone(customer.street, customer.city, customer.postal_code)
