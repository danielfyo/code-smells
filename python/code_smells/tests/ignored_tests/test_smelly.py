"""Smelly tests: Ignored Tests."""

import pytest

from .production import slugify


def test_basic_slug() -> None:
    assert slugify("Hello World") == "hello-world"


# SMELL: Ignored Test. Disabled with no reason, no ticket and no date. It probably failed
# one day, someone skipped it "temporarily" and it was never re-enabled. Today it would
# pass, but nobody knows: it is noise in the report and a false sense of coverage.
@pytest.mark.skip
def test_accents_are_removed() -> None:
    assert slugify("Caf\u00e9 Cr\u00e8me Br\u00fbl\u00e9e") == "cafe-creme-brulee"


# SMELL: another way of ignoring a test: commenting it out entirely.
# def test_symbols_are_collapsed():
#     assert slugify("C# & .NET!!") == "c-net"
