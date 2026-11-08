import pytest

from . import refactored, smelly

ACCESSES = ["quixote", "hamlet", "quixote", "odyssey", "hamlet", "quixote", "beowulf"]


def test_same_top_books() -> None:
    expected = [("quixote", 3), ("hamlet", 2), ("odyssey", 1)]
    assert smelly.top_books(ACCESSES, 3) == refactored.top_books(ACCESSES, 3) == expected


def test_same_grouping() -> None:
    records = [("anna", "quixote"), ("louis", "hamlet"), ("anna", "odyssey")]
    assert smelly.by_user(records) == refactored.by_user(records)


@pytest.mark.parametrize("path", ["books/quixote.epub", "a/b/report.tar.gz", "README", "x/.env"])
def test_extension(path: str) -> None:
    if path == "x/.env":
        # The home-made version treats ".env" as an extension; pathlib (correctly) treats it as a name.
        assert smelly.file_extension(path) == ".env"
        assert refactored.file_extension(path) == ""
    else:
        assert smelly.file_extension(path) == refactored.file_extension(path)
