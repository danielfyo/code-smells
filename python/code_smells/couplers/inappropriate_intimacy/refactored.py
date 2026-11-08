"""Refactored version: each class exposes an interface and protects its state."""

from collections.abc import Mapping
from dataclasses import dataclass, field
from enum import Enum


class Status(str, Enum):
    NEW = "NEW"
    BACKORDERED = "BACKORDERED"
    SHIPPED = "SHIPPED"


@dataclass
class Order:
    order_id: str
    _items: dict[str, int]
    _status: Status = Status.NEW
    _history: list[str] = field(default_factory=list)

    # REFACTOR: Encapsulate Collection. A read-only view is exposed.
    @property
    def items(self) -> Mapping[str, int]:
        return dict(self._items)

    @property
    def status(self) -> Status:
        return self._status

    @property
    def history(self) -> tuple[str, ...]:
        return tuple(self._history)

    # REFACTOR: Move Method. The order itself decides its state transitions.
    def mark(self, status: Status) -> None:
        if self._status is not Status.NEW:
            raise ValueError("Only new orders can be processed")
        self._status = status
        self._history.append(status.value)


@dataclass
class Warehouse:
    _stock: dict[str, int]

    def can_serve(self, items: Mapping[str, int]) -> bool:
        return all(self._stock.get(sku, 0) >= qty for sku, qty in items.items())

    def fulfil(self, order: Order) -> bool:
        # REFACTOR: Hide Delegate / use the public interface. Warehouse only talks to
        # Order through items, status and mark().
        if order.status is not Status.NEW:
            return False
        if not self.can_serve(order.items):
            order.mark(Status.BACKORDERED)
            return False
        for sku, qty in order.items.items():
            self._stock[sku] -= qty
        order.mark(Status.SHIPPED)
        return True
