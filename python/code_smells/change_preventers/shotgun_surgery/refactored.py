"""Refactored version: knowledge about taxes lives in a single place."""

from dataclasses import dataclass, field


# REFACTOR: Move Method / Move Field + Combine Functions into Class. Everything
# about VAT is concentrated in VatPolicy; a rate change is done in a single line.
@dataclass(frozen=True)
class VatPolicy:
    rate: float = 0.21

    @property
    def percent_label(self) -> str:
        return f"{self.rate * 100:.0f}%"

    def tax(self, net: float) -> float:
        return round(net * self.rate, 2)

    def gross(self, net: float) -> float:
        # If tomorrow we decide to use Decimal or banker's rounding, only this changes.
        return round(net * (1 + self.rate), 2)


VAT = VatPolicy()


@dataclass
class Cart:
    vat: VatPolicy = VAT
    lines: list[tuple[str, float]] = field(default_factory=list)

    def add(self, sku: str, net_price: float) -> None:
        self.lines.append((sku, net_price))

    def total(self) -> float:
        return self.vat.gross(sum(p for _, p in self.lines))


@dataclass(frozen=True)
class InvoicePrinter:
    vat: VatPolicy = VAT

    def tax_line(self, net: float) -> str:
        return f"VAT ({self.vat.percent_label}): {self.vat.tax(net):.2f}"


@dataclass(frozen=True)
class PriceTag:
    vat: VatPolicy = VAT

    def label(self, sku: str, net_price: float) -> str:
        return f"{sku}: {self.vat.gross(net_price):.2f} EUR (VAT incl.)"


@dataclass(frozen=True)
class RefundCalculator:
    vat: VatPolicy = VAT

    def refund(self, net_paid: float) -> float:
        return self.vat.gross(net_paid)
