"""Smelly version: an inventory transfer that swallows errors."""

import logging

log = logging.getLogger(__name__)


def transfer_stock(stock: dict[str, dict[str, int]], sku: str, src: str, dst: str, qty: int) -> None:
    # SMELL: Swallowed Exceptions. Stock is deducted from the source and, if
    # something fails afterwards (missing destination warehouse), the exception is
    # caught and only logged. The caller believes everything went fine and the units
    # have vanished: inconsistent state.
    try:
        if stock[src].get(sku, 0) < qty:
            raise ValueError("Insufficient stock")
        stock[src][sku] -= qty
        stock[dst][sku] = stock[dst].get(sku, 0) + qty
    except Exception as exc:  # noqa: BLE001
        log.warning("Transfer error: %s", exc)
        # SMELL: it neither re-raises nor undoes the partial change.
