"""Refactored version: the main method orchestrates small, named steps."""

from dataclasses import dataclass

TAX_RATE = 0.21
FREE_SHIPPING_THRESHOLD = 50
STANDARD_SHIPPING = 4.95


@dataclass(frozen=True)
class Totals:
    subtotal: float
    discount: float
    tax: float
    shipping: float

    @property
    def total(self) -> float:
        return round(self.subtotal - self.discount + self.tax + self.shipping, 2)


def process_order(order: dict) -> str:
    # REFACTOR: Compose Method. The main method reads like a table of contents;
    # each step was obtained with Extract Method and can be tested in isolation.
    validate(order)
    totals = compute_totals(order)
    return format_receipt(order, totals)


def validate(order: dict) -> None:
    if not order.get("items"):
        raise ValueError("The order has no lines")
    for item in order["items"]:
        if item["qty"] <= 0:
            raise ValueError(f"Invalid quantity for {item['sku']}")


def subtotal_of(order: dict) -> float:
    return sum(item["price"] * item["qty"] for item in order["items"])


def discount_for(subtotal: float, coupon: str | None) -> float:
    if coupon == "WELCOME10":
        return subtotal * 0.10
    if subtotal > 200:
        return subtotal * 0.05
    return 0.0


def shipping_for(taxable: float) -> float:
    return 0.0 if taxable >= FREE_SHIPPING_THRESHOLD else STANDARD_SHIPPING


def compute_totals(order: dict) -> Totals:
    # REFACTOR: Replace Temp with Query. Each amount comes from a named function.
    subtotal = subtotal_of(order)
    discount = discount_for(subtotal, order.get("coupon"))
    taxable = subtotal - discount
    return Totals(subtotal, discount, taxable * TAX_RATE, shipping_for(taxable))


def format_receipt(order: dict, totals: Totals) -> str:
    lines = [f"Order for {order['customer']}"]
    lines += [f"  {i['qty']} x {i['sku']} @ {i['price']:.2f}" for i in order["items"]]
    lines += [
        f"Subtotal: {totals.subtotal:.2f}",
        f"Discount: -{totals.discount:.2f}",
        f"VAT: {totals.tax:.2f}",
        f"Shipping: {totals.shipping:.2f}",
        f"Total: {totals.total:.2f}",
    ]
    return "\n".join(lines)
