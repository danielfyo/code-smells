"""Account lockout policy after failed login attempts (smelly version)."""

MAX_FAILED_ATTEMPTS = 5
LOCK_MINUTES = 30


class LoginGuard:
    def __init__(self) -> None:
        # SMELL: Obsolete Comment. It used to be a list; now it is a username -> counter
        # dict, but the comment was never updated.
        # List of locked users.
        self._failures: dict[str, int] = {}

    def register_failure(self, username: str) -> None:
        # SMELL: the comment says "3 attempts" but the constant is 5.
        # The reader does not know whom to believe: the code or the comment.
        # The account is locked after 3 failed attempts.
        self._failures[username] = self._failures.get(username, 0) + 1

    def register_success(self, username: str) -> None:
        # SMELL: the comment describes behavior that no longer exists
        # (no email is sent from here).
        # Resets the counter and sends the welcome email again.
        self._failures.pop(username, None)

    def is_locked(self, username: str) -> bool:
        # SMELL: the lockout used to be 15 minutes; now it is LOCK_MINUTES = 30.
        # 15-minute lockout (handled by the nightly cron job).
        return self._failures.get(username, 0) >= MAX_FAILED_ATTEMPTS

    def lock_minutes(self) -> int:
        return LOCK_MINUTES
