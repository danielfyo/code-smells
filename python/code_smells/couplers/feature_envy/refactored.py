"""Refactored version: the behaviour moves next to the data it uses."""

from dataclasses import dataclass


@dataclass(frozen=True)
class OrderLine:
    unit_price: float
    quantity: int
    discount_pct: float
    weight_kg: float

    # REFACTOR: Move Method. The calculations that depended only on the line now live
    # in the line ("put the behaviour where the data is").
    @property
    def total(self) -> float:
        gross = self.unit_price * self.quantity
        return round(gross - gross * self.discount_pct / 100, 2)

    @property
    def shipping_weight(self) -> float:
        return round(self.weight_kg * self.quantity, 3)


class BillingService:
    def invoice_total(self, lines: list[OrderLine]) -> float:
        return round(sum(line.total for line in lines), 2)
