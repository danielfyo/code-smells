"""Smelly version: the "VAT" concept is scattered across several classes."""


class Cart:
    def __init__(self) -> None:
        self.lines: list[tuple[str, float]] = []

    def add(self, sku: str, net_price: float) -> None:
        self.lines.append((sku, net_price))

    def total(self) -> float:
        # SMELL: Shotgun Surgery. The VAT rate (21 %) and the rounding are here...
        return round(sum(p for _, p in self.lines) * 1.21, 2)


class InvoicePrinter:
    def tax_line(self, net: float) -> str:
        # SMELL: ...and here, written in a different way...
        return f"VAT (21%): {round(net * 0.21, 2):.2f}"


class PriceTag:
    def label(self, sku: str, net_price: float) -> str:
        # SMELL: ...and here again. If VAT changes or a reduced rate is added, you
        # must make small changes in all these classes (and find them all).
        return f"{sku}: {net_price + net_price * 21 / 100:.2f} EUR (VAT incl.)"


class RefundCalculator:
    def refund(self, net_paid: float) -> float:
        # SMELL: ...and a fourth copy.
        return round(net_paid * (1 + 0.21), 2)
