"""Newsletter subscriber sign-up (smelly version)."""

import re

EMAIL_PATTERN = re.compile(r"^[^@\s]+@[^@\s]+\.[a-z]{2,}$")


class NewsletterService:
    def __init__(self) -> None:
        self.subscribers: list[str] = []
        self.sent_welcome: list[str] = []

    # SMELL: Binary Operator in Name. The "And" gives away that the function does three
    # things (validate, save and send an email). You cannot validate without saving, nor
    # save without sending the email (e.g. during a bulk import).
    def validate_and_save_and_send_welcome(self, email: str) -> bool:
        email = email.strip().lower()
        if not EMAIL_PATTERN.match(email) or email in self.subscribers:
            return False
        self.subscribers.append(email)
        self.sent_welcome.append(email)
        return True
