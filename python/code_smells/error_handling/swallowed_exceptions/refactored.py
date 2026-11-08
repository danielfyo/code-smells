"""Refactored version: validate before mutating and let errors propagate."""


class StockError(Exception):
    """Domain error when moving inventory."""


class UnknownWarehouse(StockError):
    pass


class InsufficientStock(StockError):
    pass


def transfer_stock(
    stock: dict[str, dict[str, int]], sku: str, src: str, dst: str, qty: int
) -> None:
    # REFACTOR: Fail Fast. Every check happens BEFORE modifying anything, so a
    # failed operation never leaves the inventory half-done.
    for warehouse in (src, dst):
        if warehouse not in stock:
            raise UnknownWarehouse(warehouse)
    if stock[src].get(sku, 0) < qty:
        raise InsufficientStock(f"{sku} in {src}")
    # REFACTOR: Replace Error Swallowing with Exception Propagation. There is no
    # generic try/except: the caller decides what to do with a StockError.
    stock[src][sku] -= qty
    stock[dst][sku] = stock[dst].get(sku, 0) + qty
