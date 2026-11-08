"""Selecting students for a scholarship."""

from collections.abc import Iterator

Student = dict[str, object]

MIN_AVERAGE = 8
INCOME_LIMIT = 30000
LOW_INCOME_LIMIT = 15000


# REFACTOR: Replace Complex Comprehension with Named Functions + Generator. Each condition is
# a named function, the output format another one, and the nested traversal an explicit
# generator. The final comprehension is trivial.
def _average(grades: list[float]) -> float:
    return sum(grades) / len(grades)


def _is_eligible(student: Student) -> bool:
    grades: list[float] = student["grades"]  # type: ignore[assignment]
    income: float = student["income"]  # type: ignore[assignment]
    has_no_failed_subject = all(grade >= 5 for grade in grades)
    return _average(grades) >= MIN_AVERAGE and income < INCOME_LIMIT and has_no_failed_subject


def _label(student: Student, class_name: str) -> str:
    name = str(student["name"])
    is_low_income = student["income"] < LOW_INCOME_LIMIT  # type: ignore[operator]
    return f"{name} ({class_name})" if is_low_income else name.upper()


def _students_by_class(classes: dict[str, list[Student]]) -> Iterator[tuple[str, Student]]:
    for class_name, students in sorted(classes.items()):
        for student in students:
            yield class_name, student


def scholarship_candidates(classes: dict[str, list[Student]]) -> list[str]:
    return [
        _label(student, class_name)
        for class_name, student in _students_by_class(classes)
        if _is_eligible(student)
    ]
