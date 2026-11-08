import pytest

from . import refactored, smelly


@pytest.mark.parametrize("module", [smelly, refactored])
def test_roundtrip(module) -> None:
    record = module.build_record("ES12AB", 12345)
    assert module.parse_record(record) == ("ES12AB", 12345)
    assert module.total_cents([record, module.build_record("FR99", 5)]) == 12350


def test_smelly_silently_drops_malformed_records() -> None:
    malformed = "ES12AB    000123450"  # one character too many
    assert smelly.total_cents([malformed]) == 0  # the amount vanishes without warning


def test_refactored_rejects_malformed_records() -> None:
    with pytest.raises(ValueError):
        refactored.total_cents(["ES12AB    000123450"])
