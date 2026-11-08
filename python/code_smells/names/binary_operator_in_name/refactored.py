"""Newsletter subscriber sign-up."""

import re

EMAIL_PATTERN = re.compile(r"^[^@\s]+@[^@\s]+\.[a-z]{2,}$")


class NewsletterService:
    def __init__(self) -> None:
        self.subscribers: list[str] = []
        self.sent_welcome: list[str] = []

    # REFACTOR: Split Function. Each responsibility has its own simply named method;
    # `subscribe` composes them for the usual case and `import_subscriber` reuses the
    # pieces without sending an email.
    def is_valid(self, email: str) -> bool:
        return bool(EMAIL_PATTERN.match(email)) and email not in self.subscribers

    def save(self, email: str) -> None:
        self.subscribers.append(email)

    def send_welcome(self, email: str) -> None:
        self.sent_welcome.append(email)

    def subscribe(self, email: str) -> bool:
        email = email.strip().lower()
        if not self.is_valid(email):
            return False
        self.save(email)
        self.send_welcome(email)
        return True

    def import_subscriber(self, email: str) -> bool:
        email = email.strip().lower()
        if not self.is_valid(email):
            return False
        self.save(email)
        return True
