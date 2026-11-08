import pytest

from . import refactored, smelly

ROTA = ["Anna", "Louis", "Eve", "Ian", "Martha", "Sarah", "Paul"]


def test_exact_names_work_in_both() -> None:
    assert smelly.shift_for("wednesday", ROTA) == refactored.shift_for("wednesday", ROTA) == "Eve"


def test_smelly_silently_returns_wrong_shift() -> None:
    # "Monday" capitalized: the smelly version assigns Sunday's shift without warning.
    assert smelly.shift_for("Monday", ROTA) == "Paul"


@pytest.mark.parametrize("name", ["Monday", "MONDAY", " mon "])
def test_refactored_accepts_obvious_variants(name: str) -> None:
    assert refactored.shift_for(name, ROTA) == "Anna"


def test_refactored_rejects_unknown() -> None:
    with pytest.raises(ValueError):
        refactored.day_from_name("holiday")
