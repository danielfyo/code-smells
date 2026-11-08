"""The guard clauses return exactly the same as the arrow."""

from datetime import date

import pytest

from code_smells.functions.deep_nesting import refactored, smelly

TODAY = date(2026, 6, 1)


def req(start: date, end: date, employee: str = "ana") -> dict:
    return {"employee": employee, "start": start, "end": end}


@pytest.mark.parametrize("request_", [
    None,
    req(date(2026, 5, 1), date(2026, 5, 3)),
    req(date(2026, 7, 5), date(2026, 7, 1)),
    req(date(2026, 7, 1), date(2026, 7, 3), "nobody"),
    req(date(2026, 7, 1), date(2026, 7, 30)),
    req(date(2026, 7, 1), date(2026, 7, 5)),
])
def test_same_decision(request_: dict | None) -> None:
    old_balance, new_balance = {"ana": 10}, {"ana": 10}
    assert smelly.approve_leave(request_, old_balance, TODAY) == \
        refactored.approve_leave(request_, new_balance, TODAY)
    assert old_balance == new_balance
