"""User sessions in a web application (smelly version)."""

import itertools


class SessionRegistry:
    def __init__(self) -> None:
        self._sessions: dict[str, int] = {}
        self._ids = itertools.count(1)
        self.audit_log: list[str] = []

    # SMELL: Names Hiding Side Effects. `get_session` sounds like a pure query, but if the
    # session does not exist it CREATES it, stores it and writes to the audit log. Anyone
    # calling it "just to look" (e.g. from an admin panel) creates phantom sessions.
    def get_session(self, username: str) -> int:
        if username not in self._sessions:
            self._sessions[username] = next(self._ids)
            self.audit_log.append(f"login {username}")
        return self._sessions[username]

    def active_count(self) -> int:
        return len(self._sessions)
