"""Final grade calculation for a student."""

# REFACTOR: Move Declaration Closer to Usage + order the module top-down (newspaper rule):
# the public function first and its helpers right below, each constant next to its only use
# and each variable declared on the line where it is needed.
EXAM_WEIGHT = 0.6
PROJECT_WEIGHT = 0.4
MIN_ATTENDANCE = 0.8


def final_grade(exam: float, project: float, attendance: float) -> tuple[float, str]:
    weighted = _weighted_average(exam, project)
    penalty = 1.0 if attendance < MIN_ATTENDANCE else 0.0
    grade = round(max(weighted - penalty, 0.0), 1)
    return grade, _label(grade)


def _weighted_average(exam: float, project: float) -> float:
    weighted = exam * EXAM_WEIGHT + project * PROJECT_WEIGHT
    return min(weighted, 4.0) if exam < 4 else weighted


PASS_MARK = 5.0


def _label(grade: float) -> str:
    if grade >= 9:
        return "Outstanding"
    return "Pass" if grade >= PASS_MARK else "Fail"
