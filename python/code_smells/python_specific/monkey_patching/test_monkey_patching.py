import json
from collections.abc import Iterator
from datetime import date
from types import ModuleType

import pytest

from . import refactored


@pytest.fixture
def smelly_module() -> Iterator[ModuleType]:
    from . import smelly

    json.dumps = smelly._dumps_with_dates  # make sure we are in the patched state
    yield smelly
    smelly.unpatch()


def test_same_receipt(smelly_module: ModuleType) -> None:
    pickup = date(2026, 4, 2)
    expected = '{"ticket": "L-77", "pickup": "2026-04-02", "total": 12.5}'
    assert smelly_module.receipt_json("L-77", pickup, 12.5) == expected
    assert refactored.receipt_json("L-77", pickup, 12.5) == expected


def test_smelly_changes_json_for_everyone(smelly_module: ModuleType) -> None:
    # Third-party code expecting a TypeError for non-serializable objects no longer gets it.
    assert json.dumps({"x": object()}).startswith('{"x": "<object object')


def test_refactored_leaves_json_untouched() -> None:
    with pytest.raises(TypeError):
        json.dumps({"when": date(2026, 4, 2)})
