"""Smelly version: the billing service envies the order line's data."""

from dataclasses import dataclass


@dataclass
class OrderLine:
    unit_price: float
    quantity: int
    discount_pct: float
    weight_kg: float


class BillingService:
    def line_total(self, line: OrderLine) -> float:
        # SMELL: Feature Envy. The method uses nothing from BillingService; it only
        # reads and combines OrderLine fields. The logic is in the wrong class.
        gross = line.unit_price * line.quantity
        return round(gross - gross * line.discount_pct / 100, 2)

    def line_shipping_weight(self, line: OrderLine) -> float:
        # SMELL: again, all the information belongs to the line.
        return round(line.weight_kg * line.quantity, 3)

    def invoice_total(self, lines: list[OrderLine]) -> float:
        return round(sum(self.line_total(line) for line in lines), 2)
