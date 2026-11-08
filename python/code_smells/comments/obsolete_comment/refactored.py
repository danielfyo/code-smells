"""Account lockout policy after failed login attempts."""

# REFACTOR: Remove/Update Obsolete Comment. The lying comments are gone; the information
# they carried (threshold, minutes) already lives in named constants, which cannot drift
# out of sync with the code that uses them.
MAX_FAILED_ATTEMPTS = 5
LOCK_MINUTES = 30


class LoginGuard:
    def __init__(self) -> None:
        self._failed_attempts_by_user: dict[str, int] = {}

    def register_failure(self, username: str) -> None:
        self._failed_attempts_by_user[username] = self._failed_attempts_by_user.get(username, 0) + 1

    def register_success(self, username: str) -> None:
        self._failed_attempts_by_user.pop(username, None)

    def is_locked(self, username: str) -> bool:
        return self._failed_attempts_by_user.get(username, 0) >= MAX_FAILED_ATTEMPTS

    def lock_minutes(self) -> int:
        return LOCK_MINUTES
