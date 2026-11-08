"""Refactored version: the check is pure and state changes are explicit."""

from dataclasses import dataclass, field

MAX_FAILURES = 3


@dataclass
class Account:
    password: str
    failures: int = 0
    locked: bool = False

    # REFACTOR: Separate Query from Modifier. This query changes nothing.
    def password_matches(self, password: str) -> bool:
        return self.password == password and not self.locked

    def register_success(self) -> None:
        self.failures = 0

    def register_failure(self) -> None:
        self.failures += 1
        self.locked = self.failures >= MAX_FAILURES


@dataclass
class LoginService:
    # REFACTOR: the log is no longer global; it is injected as service state.
    accounts: dict[str, Account]
    audit_log: list[str] = field(default_factory=list)

    def login(self, username: str, password: str) -> bool:
        # REFACTOR: the name `login` announces an operation with effects.
        account = self.accounts[username]
        self.audit_log.append(f"login {username}")
        ok = account.password_matches(password)
        if ok:
            account.register_success()
        else:
            account.register_failure()
        return ok
