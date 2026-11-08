import json
from unittest import mock

import pytest

from . import refactored, smelly


@pytest.mark.parametrize(
    ("raw", "expected"),
    [
        ('{"sensor": {"threshold": 30.5}}', 30.5),
        ("not json", 25.0),
        ('{"sensor": {}}', 25.0),
        ('{"sensor": {"threshold": "high"}}', 25.0),
    ],
)
def test_same_result_for_expected_errors(raw: str, expected: float) -> None:
    assert smelly.read_threshold(raw) == refactored.read_threshold(raw) == expected


def test_smelly_swallows_keyboard_interrupt() -> None:
    with mock.patch.object(json, "loads", side_effect=KeyboardInterrupt):
        assert smelly.read_threshold("{}") == 25.0  # the user's Ctrl+C is lost!


def test_refactored_lets_keyboard_interrupt_through() -> None:
    with (
        mock.patch.object(json, "loads", side_effect=KeyboardInterrupt),
        pytest.raises(KeyboardInterrupt),
    ):
        refactored.read_threshold("{}")
