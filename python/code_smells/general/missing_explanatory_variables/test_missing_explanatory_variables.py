import itertools

from . import refactored, smelly


def test_same_decision_on_grid() -> None:
    for age, income, debts, years, amount in itertools.product(
        [17, 22, 40, 71], [1500, 3500], [0, 400], [0.5, 3], [3000, 12000, 30000]
    ):
        assert smelly.is_eligible(age, income, debts, years, amount) == refactored.is_eligible(
            age, income, debts, years, amount
        )


def test_known_cases() -> None:
    assert refactored.is_eligible(30, 2500, 200, 2, 10000)
    assert not refactored.is_eligible(30, 2500, 800, 2, 10000)  # excessive debt ratio
