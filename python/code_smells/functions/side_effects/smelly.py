"""Smelly version: a "query" function that also modifies state."""

audit_log: list[str] = []


def check_password(users: dict[str, dict], username: str, password: str) -> bool:
    # SMELL: Side Effects. The name promises only to check, but it also:
    #  1) writes to a global log,
    #  2) increments the user's counters (mutates the argument),
    #  3) locks the account on the third failure.
    # Calling it "just to see" changes the system.
    user = users[username]
    audit_log.append(f"login {username}")
    if user["password"] == password and not user["locked"]:
        user["failures"] = 0
        return True
    user["failures"] += 1
    if user["failures"] >= 3:
        user["locked"] = True
    return False
