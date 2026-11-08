from . import refactored, smelly


def test_same_message_sent() -> None:
    old = smelly.SmtpNotifier()
    new = refactored.EmailNotifier()
    smelly.notify_shipment(old, "anna@example.com", "A-17")
    refactored.notify_shipment(new, "anna@example.com", "A-17")
    assert old.outbox == new.outbox == [("anna@example.com", "Your order A-17 has shipped")]


def test_any_channel_works_with_refactored() -> None:
    class SmsNotifier:
        def __init__(self) -> None:
            self.sent: list[str] = []

        def notify(self, recipient: str, message: str) -> None:
            self.sent.append(f"{recipient}:{message}")

    sms = SmsNotifier()
    refactored.notify_shipment(sms, "+34600000000", "B-2")
    assert sms.sent == ["+34600000000:Your order B-2 has shipped"]
