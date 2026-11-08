"""Event capacity control (smelly version)."""


# SMELL: Identity vs Equality. Values are compared with `is`, which checks whether they are
# THE SAME object, not whether they have the same value. It works "by chance" with small
# integers (CPython caches -5..256) and with interned strings, and fails with large
# capacities or strings built at runtime.
def is_full(attendees: int, capacity: int) -> bool:
    return attendees is capacity


def is_vip(ticket_type: str) -> bool:
    return ticket_type is "VIP"  # noqa: F632  (SyntaxWarning since Python 3.8)
