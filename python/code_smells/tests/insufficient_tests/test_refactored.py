"""Clean tests: they cover every relevant branch of invoice_total."""

import pytest

from .production import invoice_total


# REFACTOR: Add Missing Tests guided by coverage (e.g. `pytest --cov --cov-branch`).
# Each VAT rate, the empty case, the rounding and every error branch are tested.
@pytest.mark.parametrize(
    ("vat_type", "expected"),
    [("general", 121.0), ("reduced", 110.0), ("super_reduced", 104.0)],
)
def test_applies_each_vat_rate(vat_type: str, expected: float) -> None:
    assert invoice_total([(100.0, 1, vat_type)]) == expected


def test_empty_invoice_is_zero() -> None:
    assert invoice_total([]) == 0


def test_mixed_lines_are_summed_and_rounded() -> None:
    assert invoice_total([(9.99, 3, "general"), (1.05, 1, "reduced")]) == 37.42


@pytest.mark.parametrize("line", [(-1.0, 1, "general"), (10.0, -1, "general")])
def test_rejects_negative_values(line: tuple[float, int, str]) -> None:
    with pytest.raises(ValueError):
        invoice_total([line])


def test_rejects_unknown_vat_type() -> None:
    with pytest.raises(KeyError):
        invoice_total([(10.0, 1, "luxury")])
