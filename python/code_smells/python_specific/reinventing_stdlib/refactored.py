"""Analysis of a digital library's access logs."""

from collections import Counter, defaultdict
from pathlib import PurePosixPath


# REFACTOR: Substitute Algorithm with Standard Library. `Counter.most_common` counts and sorts
# (stably), `defaultdict(list)` groups and `PurePosixPath.suffix` extracts the extension.
def top_books(accesses: list[str], n: int) -> list[tuple[str, int]]:
    return Counter(accesses).most_common(n)


def by_user(records: list[tuple[str, str]]) -> dict[str, list[str]]:
    grouped: defaultdict[str, list[str]] = defaultdict(list)
    for user, book in records:
        grouped[user].append(book)
    return dict(grouped)


def file_extension(path: str) -> str:
    return PurePosixPath(path).suffix
