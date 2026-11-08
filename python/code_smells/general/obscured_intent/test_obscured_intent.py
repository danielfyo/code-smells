import pytest

from . import refactored, smelly


@pytest.mark.parametrize(
    ("number", "valid"),
    [("4539578763621486", True), ("4539578763621487", False), ("79927398713", True), ("0", True)],
)
def test_same_validation(number: str, valid: bool) -> None:
    assert smelly.ok(number) is valid
    assert refactored.is_valid_card_number(number) is valid
