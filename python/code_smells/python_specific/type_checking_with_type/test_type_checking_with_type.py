import pytest

from . import refactored, smelly


@pytest.mark.parametrize(
    ("class_name", "expected"), [("Payment", 0.0), ("CardPayment", 1.5), ("TransferPayment", 0.35)]
)
def test_same_fee_for_base_types(class_name: str, expected: float) -> None:
    assert smelly.fee(getattr(smelly, class_name)(100)) == expected
    assert refactored.fee(getattr(refactored, class_name)(100)) == expected


def test_smelly_ignores_inheritance() -> None:
    assert smelly.fee(smelly.PremiumCardPayment(100)) == 0.0  # bug!


def test_refactored_respects_inheritance() -> None:
    assert refactored.fee(refactored.PremiumCardPayment(100)) == 1.5
