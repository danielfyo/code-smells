"""Selecting students for a scholarship (smelly version)."""

Student = dict[str, object]


# SMELL: Complex Comprehension. A single comprehension with two `for` clauses, several `if`
# clauses, a conditional expression and nested calculations. It looks "pythonic", but it is
# impossible to read, debug or comment step by step.
def scholarship_candidates(classes: dict[str, list[Student]]) -> list[str]:
    return [
        f"{s['name']} ({c})" if s["income"] < 15000 else s["name"].upper()  # type: ignore[union-attr]
        for c, students in sorted(classes.items())
        for s in students
        if sum(s["grades"]) / len(s["grades"]) >= 8  # type: ignore[arg-type]
        and s["income"] < 30000  # type: ignore[operator]
        and not any(g < 5 for g in s["grades"])  # type: ignore[attr-defined]
    ]
