"""Same fines with self-explanatory code."""

from datetime import date

import pytest

from code_smells.dispensables.excessive_comments import refactored, smelly

DUE = date(2026, 3, 1)


@pytest.mark.parametrize("returned", [date(2026, 2, 20), date(2026, 3, 5), date(2026, 5, 1)])
@pytest.mark.parametrize("member", [1, 2])
@pytest.mark.parametrize("price", [3.0, 30.0])
def test_same_fine(returned: date, member: int, price: float) -> None:
    old = smelly.calc({"due": DUE, "t": member, "p": price}, returned)
    loan = refactored.Loan(DUE, refactored.MemberType(member), price)
    assert old == loan.late_fee(returned)
