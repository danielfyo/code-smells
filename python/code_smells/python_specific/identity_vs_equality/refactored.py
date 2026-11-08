"""Event capacity control."""


# REFACTOR: Replace Identity Comparison with Equality. `==` (and `>=` where it makes sense)
# is used to compare values. `is` is kept only for singletons such as `None`.
def is_full(attendees: int, capacity: int) -> bool:
    return attendees >= capacity


def is_vip(ticket_type: str) -> bool:
    return ticket_type == "VIP"
