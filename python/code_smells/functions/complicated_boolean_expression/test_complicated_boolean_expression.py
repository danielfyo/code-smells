"""The named predicates match the original expression for every combination."""

from itertools import product

from code_smells.functions.complicated_boolean_expression import refactored, smelly


def test_equivalent_on_grid() -> None:
    grid = product([17, 30, 71], [700, 900, 1500], [False, True], [0, 300, 600],
                   [0, 1, 2], [2, 6])
    keys = ["age", "monthly_income", "has_guarantor", "monthly_debt", "defaults",
            "years_since_default"]
    checked = 0
    for values in grid:
        applicant = dict(zip(keys, values))
        assert smelly.is_eligible(applicant) == refactored.is_eligible(applicant), applicant
        checked += 1
    assert checked == 324
