"""User sessions in a web application."""

import itertools


class SessionRegistry:
    def __init__(self) -> None:
        self._sessions: dict[str, int] = {}
        self._ids = itertools.count(1)
        self.audit_log: list[str] = []

    # REFACTOR: Separate Query from Modifier. `find_session` is a side-effect-free query;
    # `get_or_create_session` declares in its name that it may create and audit.
    def find_session(self, username: str) -> int | None:
        return self._sessions.get(username)

    def get_or_create_session(self, username: str) -> int:
        session_id = self.find_session(username)
        if session_id is None:
            session_id = next(self._ids)
            self._sessions[username] = session_id
            self.audit_log.append(f"login {username}")
        return session_id

    def active_count(self) -> int:
        return len(self._sessions)
