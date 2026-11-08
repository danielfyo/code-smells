"""Checkout process: check stock, charge and ship (smelly version)."""

from collections.abc import Callable

Callback = Callable[[str | None, object], None]

STOCK = {"SKU-1": 5, "SKU-2": 0}


def check_stock(sku: str, callback: Callback) -> None:
    callback(None, STOCK.get(sku, 0) > 0)


def charge_card(card: str, amount: float, callback: Callback) -> None:
    if card.startswith("4"):
        callback(None, f"TX-{round(amount * 100)}")
    else:
        callback("card declined", None)


def create_shipment(sku: str, callback: Callback) -> None:
    callback(None, f"SHIP-{sku}")


# SMELL: Callback Hell (pyramid of doom). Each asynchronous step nests the next one, error
# handling is repeated at every level and the real flow (stock -> charge -> shipment) is
# buried under the indentation.
def checkout(sku: str, card: str, amount: float, done: Callable[[str], None]) -> None:
    def on_stock(err: str | None, available: object) -> None:
        if err:
            done(f"error: {err}")
            return
        if not available:
            done("error: out of stock")
            return

        def on_charge(err: str | None, tx: object) -> None:
            if err:
                done(f"error: {err}")
                return

            def on_ship(err: str | None, shipment: object) -> None:
                if err:
                    done(f"error: {err}")
                    return
                done(f"ok: {tx} {shipment}")

            create_shipment(sku, on_ship)

        charge_card(card, amount, on_charge)

    check_stock(sku, on_stock)
