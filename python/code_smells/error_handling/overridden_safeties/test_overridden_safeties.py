"""Valid data: same result. Invalid data: the smelly version hides it."""

import warnings

from code_smells.error_handling.overridden_safeties import refactored, smelly

GOOD = [("A", "10,50"), ("B", "3")]
BAD = GOOD + [("C", "-4")]


def test_same_prices_for_valid_rows() -> None:
    with warnings.catch_warnings():  # isolates the global filter the smelly version installs
        assert smelly.import_price_list(GOOD) == refactored.import_price_list(GOOD).prices


def test_smelly_hides_invalid_prices_and_global_warnings() -> None:
    with warnings.catch_warnings():
        prices = smelly.import_price_list(BAD)
        assert prices["C"] == -4.0  # the negative price got in without warning
        with warnings.catch_warnings(record=True) as caught:
            warnings.warn("warning from another module", DeprecationWarning)
        assert caught == []  # the global filter silenced other modules too!


def test_refactored_reports_invalid_rows() -> None:
    result = refactored.import_price_list(BAD)
    assert result.prices == {"A": 10.5, "B": 3.0}
    assert list(result.rejected) == ["C"]
