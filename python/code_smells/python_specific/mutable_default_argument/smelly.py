"""Building orders in a restaurant (smelly version)."""


# SMELL: Mutable Default Argument. The `extras=[]` list is created ONCE, when the function is
# defined, and shared by every call that does not pass the argument. Each order "inherits"
# the extras of the previous ones: a latent bug that raises no error at all.
def build_order(dish: str, extras: list[str] = []) -> list[str]:
    extras.append(dish)
    return extras


def add_tag(tags: dict[str, int] = {}, tag: str = "new") -> dict[str, int]:
    # SMELL: same thing with a dict: the counter survives between calls.
    tags[tag] = tags.get(tag, 0) + 1
    return tags
