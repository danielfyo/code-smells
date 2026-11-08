"""The return value contains what the output arguments used to be filled with."""

from typing import Any

import pytest

from code_smells.functions.output_arguments import refactored, smelly


@pytest.mark.parametrize(
    "order",
    [
        {"customer": "Ana", "lines": [("A", 2), ("B", 1)]},
        {"customer": "", "lines": []},
        {},
    ],
)
def test_same_result(order: dict[str, Any]) -> None:
    errors: list[str] = []
    summary: dict[str, Any] = {}
    smelly.validate_order(order, errors, summary)
    result = refactored.validate_order(order)
    assert (errors, summary["lines"], summary["units"]) == (
        list(result.errors),
        result.lines,
        result.units,
    )
    assert result.is_valid == (not errors)
