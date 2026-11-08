"""Customer notifications (smelly version)."""


class SmtpNotifier:
    """Sends notices to customers. Email today; maybe SMS or push tomorrow."""

    def __init__(self) -> None:
        self.outbox: list[tuple[str, str]] = []

    # SMELL: Wrong Abstraction Level Name. The name reveals the implementation (SMTP, socket)
    # instead of the business concept ("notify"). If we switch to SMS, the name lies or has
    # to be renamed in every caller.
    def open_smtp_socket_and_send_mime(self, customer_email: str, text: str) -> None:
        self.outbox.append((customer_email, text))


def notify_shipment(notifier: SmtpNotifier, customer_email: str, order_id: str) -> None:
    # SMELL: high-level logic ("notify about the shipment") talks in protocol terms.
    notifier.open_smtp_socket_and_send_mime(customer_email, f"Your order {order_id} has shipped")
