"""Customer notifications."""

from typing import Protocol


# REFACTOR: Rename Method to the domain abstraction level (`notify`) and Extract Interface:
# the channel (email, SMS...) is a detail of the concrete implementation.
class Notifier(Protocol):
    def notify(self, recipient: str, message: str) -> None: ...


class EmailNotifier:
    def __init__(self) -> None:
        self.outbox: list[tuple[str, str]] = []

    def notify(self, recipient: str, message: str) -> None:
        # The SMTP/MIME details would go here, encapsulated and not leaking into the name.
        self.outbox.append((recipient, message))


def notify_shipment(notifier: Notifier, customer_email: str, order_id: str) -> None:
    notifier.notify(customer_email, f"Your order {order_id} has shipped")
