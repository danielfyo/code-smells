"""Final grade calculation for a student (smelly version)."""

# SMELL: Vertical Separation. Constants and variables declared far from where they are used,
# and helper functions at the bottom of the module, separated from their only caller by
# unrelated code. The reader has to jump up and down to follow the reasoning.
EXAM_WEIGHT = 0.6
ROUNDING = 1
PASS_MARK = 5.0
PROJECT_WEIGHT = 0.4


def final_grade(exam: float, project: float, attendance: float) -> tuple[float, str]:
    penalty = 0.0  # SMELL: declared here, used many lines below.
    label = ""
    weighted = exam * EXAM_WEIGHT + project * PROJECT_WEIGHT
    if exam < 4:
        weighted = min(weighted, 4.0)
    # ... imagine 30 lines of other checks here ...
    if attendance < 0.8:
        penalty = 1.0
    grade = round(max(weighted - penalty, 0.0), ROUNDING)
    label = _label(grade)
    return grade, label


def unrelated_helper_for_reports(name: str) -> str:
    return name.title()


def another_unrelated_helper(values: list[float]) -> float:
    return sum(values) / len(values) if values else 0.0


def _label(grade: float) -> str:
    # SMELL: PASS_MARK is defined at the top of the file, far from here.
    if grade >= 9:
        return "Outstanding"
    return "Pass" if grade >= PASS_MARK else "Fail"
