"""Building orders in a restaurant."""


# REFACTOR: Replace Mutable Default with None. `None` is used as a sentinel and a fresh
# container is created inside the function on every call. The input is also copied so the
# caller's list is never mutated.
def build_order(dish: str, extras: list[str] | None = None) -> list[str]:
    order = list(extras) if extras is not None else []
    order.append(dish)
    return order


def add_tag(tags: dict[str, int] | None = None, tag: str = "new") -> dict[str, int]:
    result = dict(tags) if tags is not None else {}
    result[tag] = result.get(tag, 0) + 1
    return result
