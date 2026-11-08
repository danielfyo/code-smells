"""Refactored version: both channels fulfil the same interface and are interchangeable."""

from dataclasses import dataclass, field
from typing import Protocol


# REFACTOR: Rename Method + Change Function Declaration until the signatures match, and
# Extract Interface (here a Protocol) so the client depends on the contract.
class Notifier(Protocol):
    def send(self, recipient: str, subject: str, body: str) -> None: ...


@dataclass
class EmailSender:
    outbox: list[str] = field(default_factory=list)

    def send(self, recipient: str, subject: str, body: str) -> None:
        self.outbox.append(f"EMAIL {recipient}: {subject} - {body}")


@dataclass
class SmsGateway:
    log: list[str] = field(default_factory=list)

    def send(self, recipient: str, subject: str, body: str) -> None:
        self.log.append(f"SMS {recipient}: {subject} - {body}")


def notify_order_shipped(channel: Notifier, contact: str, order_id: str) -> None:
    # REFACTOR: no isinstance; any new channel works without touching this code.
    channel.send(contact, "Order shipped", f"Your order {order_id} is on its way")
