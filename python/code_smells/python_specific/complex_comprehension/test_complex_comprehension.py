from . import refactored, smelly

CLASSES = {
    "2B": [
        {"name": "Lucy", "grades": [9, 8.5, 9.5], "income": 12000},
        {"name": "Matthew", "grades": [9, 9, 4.5], "income": 10000},  # one failed subject
    ],
    "2A": [
        {"name": "Hugo", "grades": [8, 8, 8], "income": 22000},
        {"name": "Sarah", "grades": [10, 10, 10], "income": 45000},  # high income
        {"name": "Nora", "grades": [7, 7.5, 8], "income": 9000},  # low average
    ],
}


def test_same_candidates() -> None:
    expected = ["HUGO", "Lucy (2B)"]
    assert smelly.scholarship_candidates(CLASSES) == expected
    assert refactored.scholarship_candidates(CLASSES) == expected


def test_no_classes() -> None:
    assert smelly.scholarship_candidates({}) == refactored.scholarship_candidates({}) == []
