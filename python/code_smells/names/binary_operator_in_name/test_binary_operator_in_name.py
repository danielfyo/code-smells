import pytest

from . import refactored, smelly


@pytest.mark.parametrize("email", ["Anna@Mail.com ", "malformed", "anna@mail.com"])
def test_same_subscribe_behavior(email: str) -> None:
    old, new = smelly.NewsletterService(), refactored.NewsletterService()
    old.validate_and_save_and_send_welcome("anna@mail.com")
    new.subscribe("anna@mail.com")
    assert old.validate_and_save_and_send_welcome(email) == new.subscribe(email)
    assert old.subscribers == new.subscribers
    assert old.sent_welcome == new.sent_welcome


def test_import_without_email_is_now_possible() -> None:
    service = refactored.NewsletterService()
    assert service.import_subscriber("legacy@mail.com")
    assert service.subscribers == ["legacy@mail.com"]
    assert service.sent_welcome == []
