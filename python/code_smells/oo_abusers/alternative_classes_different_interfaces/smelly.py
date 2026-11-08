"""Smelly version: two notifiers do the same thing with different names and signatures."""


class EmailSender:
    def __init__(self) -> None:
        self.outbox: list[str] = []

    # SMELL: Alternative Classes with Different Interfaces. Sends a message to a
    # recipient...
    def send_email(self, to_address: str, subject: str, body: str) -> bool:
        self.outbox.append(f"EMAIL {to_address}: {subject} - {body}")
        return True


class SmsGateway:
    def __init__(self) -> None:
        self.log: list[str] = []

    # SMELL: ...and this class does exactly the same, but the method has a different
    # name, the argument order changes and it returns something else.
    def push_text(self, text: str, phone: str) -> str:
        self.log.append(f"SMS {phone}: {text}")
        return "OK"


def notify_order_shipped(channel: object, contact: str, order_id: str) -> None:
    # SMELL: the client has to ask for the concrete type to be able to use them.
    if isinstance(channel, EmailSender):
        channel.send_email(contact, "Order shipped", f"Your order {order_id} is on its way")
    elif isinstance(channel, SmsGateway):
        channel.push_text(f"Order shipped - Your order {order_id} is on its way", contact)
    else:
        raise TypeError("Unknown channel")
