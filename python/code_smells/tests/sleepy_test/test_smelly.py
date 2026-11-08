"""Smelly tests: Sleepy Test."""

import time

from .production import EmailQueue


# SMELL: Sleepy Test. The test "waits" for the thread to finish with an arbitrary sleep. On
# a loaded machine 0.2 s may not be enough (flaky test); on a fast one, time is wasted.
# Multiplied by hundreds of tests, the suite becomes slow and unreliable.
def test_emails_are_sent() -> None:
    emails = EmailQueue()
    emails.enqueue("anna@example.com")
    emails.enqueue("louis@example.com")
    time.sleep(0.2)
    assert emails.sent == ["anna@example.com", "louis@example.com"]
    emails.close()
