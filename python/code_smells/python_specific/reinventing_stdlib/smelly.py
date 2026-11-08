"""Analysis of a digital library's access logs (smelly version)."""


# SMELL: Reinventing the Standard Library. Hand-rolled versions of what `collections.Counter`,
# `itertools.groupby`/`defaultdict`, `max(key=...)` and `pathlib` already provide. More
# code, more bugs and less readable for anyone who knows the stdlib.
def top_books(accesses: list[str], n: int) -> list[tuple[str, int]]:
    counts: dict[str, int] = {}
    for book in accesses:
        if book in counts:
            counts[book] = counts[book] + 1
        else:
            counts[book] = 1
    items = list(counts.items())
    for i in range(len(items)):  # home-made bubble sort
        for j in range(len(items) - 1 - i):
            if items[j][1] < items[j + 1][1]:
                items[j], items[j + 1] = items[j + 1], items[j]
    return items[:n]


def by_user(records: list[tuple[str, str]]) -> dict[str, list[str]]:
    result: dict[str, list[str]] = {}
    for user, book in records:
        if user not in result:
            result[user] = []
        result[user].append(book)
    return result


def file_extension(path: str) -> str:
    name = path.split("/")[-1]
    return name[name.rfind(".") :] if "." in name else ""
