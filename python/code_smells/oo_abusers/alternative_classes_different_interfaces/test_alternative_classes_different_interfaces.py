"""The messages produced are identical; the new version does not need isinstance."""

from code_smells.oo_abusers.alternative_classes_different_interfaces import refactored, smelly


def test_same_messages() -> None:
    old_email, old_sms = smelly.EmailSender(), smelly.SmsGateway()
    smelly.notify_order_shipped(old_email, "ana@shop.com", "A-1")
    smelly.notify_order_shipped(old_sms, "600111222", "A-1")

    new_email, new_sms = refactored.EmailSender(), refactored.SmsGateway()
    for channel, contact in ((new_email, "ana@shop.com"), (new_sms, "600111222")):
        refactored.notify_order_shipped(channel, contact, "A-1")

    assert old_email.outbox == new_email.outbox
    assert old_sms.log == new_sms.log


def test_new_channel_needs_no_changes() -> None:
    class PushChannel:
        def __init__(self) -> None:
            self.sent: list[str] = []

        def send(self, recipient: str, subject: str, body: str) -> None:
            self.sent.append(recipient)

    push = PushChannel()
    refactored.notify_order_shipped(push, "device-9", "A-2")
    assert push.sent == ["device-9"]
