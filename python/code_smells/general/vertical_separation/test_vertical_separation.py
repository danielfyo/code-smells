import pytest

from . import refactored, smelly


@pytest.mark.parametrize(
    ("exam", "project", "attendance"),
    [(9.5, 9.0, 1.0), (6, 5, 0.9), (3, 10, 1.0), (6, 6, 0.5), (0, 0, 0.0)],
)
def test_same_grades(exam: float, project: float, attendance: float) -> None:
    assert smelly.final_grade(exam, project, attendance) == refactored.final_grade(
        exam, project, attendance
    )


def test_known_values() -> None:
    assert refactored.final_grade(9.5, 9.0, 1.0) == (9.3, "Outstanding")
    assert refactored.final_grade(3, 10, 1.0) == (4.0, "Fail")
