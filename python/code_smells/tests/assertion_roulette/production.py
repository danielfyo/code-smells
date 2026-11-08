"""Code under test: parser for one line of an orders CSV."""

from dataclasses import dataclass
from datetime import date


@dataclass(frozen=True)
class Order:
    order_id: str
    customer: str
    placed_on: date
    total: float
    is_express: bool


def parse_order(line: str) -> Order:
    order_id, customer, placed_on, total, express = (part.strip() for part in line.split(";"))
    return Order(
        order_id=order_id,
        customer=customer.title(),
        placed_on=date.fromisoformat(placed_on),
        total=float(total.replace(",", ".")),
        is_express=express.lower() in {"yes", "y", "true", "1"},
    )
