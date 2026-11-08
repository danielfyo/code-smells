"""Smelly version: the warehouse handles the order's private internals."""


class Order:
    def __init__(self, order_id: str, items: dict[str, int]) -> None:
        self.order_id = order_id
        self._items = dict(items)
        self._status = "NEW"
        self._history: list[str] = []


class Warehouse:
    def __init__(self, stock: dict[str, int]) -> None:
        self._stock = dict(stock)

    def fulfil(self, order: Order) -> bool:
        # SMELL: Inappropriate Intimacy. Warehouse reads and writes private attributes
        # of Order (_items, _status, _history). Any internal change in Order breaks
        # Warehouse, and the state transition rules end up outside Order.
        if order._status != "NEW":
            return False
        if any(self._stock.get(sku, 0) < qty for sku, qty in order._items.items()):
            order._status = "BACKORDERED"
            order._history.append("BACKORDERED")
            return False
        for sku, qty in order._items.items():
            self._stock[sku] -= qty
        order._status = "SHIPPED"
        order._history.append("SHIPPED")
        return True
