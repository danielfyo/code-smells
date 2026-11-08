"""Clean tests: explicit synchronization instead of sleep."""

from collections.abc import Iterator

import pytest

from .production import EmailQueue


# REFACTOR: Replace Sleep with Synchronization. The test waits for a concrete event
# (`wait_until_idle`, based on `Queue.join`) with a generous timeout that is only reached if
# there is a bug. It ends as soon as the work is done: fast and deterministic.
@pytest.fixture
def emails() -> Iterator[EmailQueue]:
    email_queue = EmailQueue()
    yield email_queue
    email_queue.close()


def test_emails_are_sent_in_order(emails: EmailQueue) -> None:
    emails.enqueue("anna@example.com")
    emails.enqueue("louis@example.com")
    emails.wait_until_idle()
    assert emails.sent == ["anna@example.com", "louis@example.com"]


def test_idle_queue_returns_immediately(emails: EmailQueue) -> None:
    emails.wait_until_idle(timeout=0.5)
    assert emails.sent == []
