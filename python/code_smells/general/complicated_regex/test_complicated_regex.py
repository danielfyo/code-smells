import pytest

from . import refactored, smelly


@pytest.mark.parametrize(
    "text",
    [
        "RES-2026030042 / 1234 BCD",
        "bk2025121234|9999xyz",
        "  RES2026030042/1234BCD  ",
        "RES-2026130042 / 1234 BCD",  # month 13
        "RES-2026030042 / 1234 BAD",  # vowel in the plate
        "XX-2026030042 / 1234 BCD",
    ],
)
def test_same_parsing(text: str) -> None:
    assert smelly.parse_booking(text) == refactored.parse_booking(text)


def test_known_value() -> None:
    assert refactored.parse_booking("bk2025121234|9999xyz") == ("2025121234", "9999XYZ")
    assert refactored.parse_booking("RES-2026130042 / 1234 BCD") is None
