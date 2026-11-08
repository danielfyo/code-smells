"""The pipelines produce the same as the manual loops."""

import pytest

from code_smells.data.loops import refactored, smelly

SHIPMENTS = [
    {"tracking": "es1", "carrier": "SEUR", "weight": 2.5, "status": "DELAYED"},
    {"tracking": "es2", "carrier": "MRW", "weight": 7.0, "status": "OK"},
    {"tracking": "ab3", "carrier": "SEUR", "weight": 1.0, "status": "DELAYED"},
]


@pytest.mark.parametrize("data", [SHIPMENTS, []])
def test_same_results(data: list[dict]) -> None:
    for fn in ("delayed_tracking_codes", "weight_by_carrier", "heaviest"):
        assert getattr(smelly, fn)(data) == getattr(refactored, fn)(data)
