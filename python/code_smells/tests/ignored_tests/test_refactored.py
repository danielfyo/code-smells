"""Clean tests: all active; if one must be skipped, the reason is documented."""

import sys

import pytest

from .production import slugify


# REFACTOR: Reactivate or Delete. The ignored tests have been re-enabled (they pass) and the
# commented-out one runs again. If a test must be skipped, use `skipif`/`xfail` with an
# explicit condition and reason, so it comes back on its own once it no longer applies.
@pytest.mark.parametrize(
    ("title", "slug"),
    [
        ("Hello World", "hello-world"),
        ("Caf\u00e9 Cr\u00e8me Br\u00fbl\u00e9e", "cafe-creme-brulee"),
        ("C# & .NET!!", "c-net"),
    ],
)
def test_slugify(title: str, slug: str) -> None:
    assert slugify(title) == slug


@pytest.mark.skipif(sys.platform == "emscripten", reason="unicodedata is incomplete in Pyodide")
def test_documented_skip_example() -> None:
    assert slugify("Na\u00efve Pi\u00f1a") == "naive-pina"
