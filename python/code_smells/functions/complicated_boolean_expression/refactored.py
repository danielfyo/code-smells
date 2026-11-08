"""Refactored version: each part of the condition has a name."""

from dataclasses import dataclass
from typing import Any

MIN_AGE, MAX_AGE = 18, 70
MIN_INCOME, MIN_INCOME_WITH_GUARANTOR = 1200, 800
MAX_DEBT_RATIO = 0.35
YEARS_TO_FORGIVE_DEFAULT = 5


@dataclass(frozen=True)
class Applicant:
    age: int
    monthly_income: float
    has_guarantor: bool
    monthly_debt: float
    defaults: int
    years_since_default: int

    # REFACTOR: Decompose Conditional / Extract Function. Each sub-condition becomes
    # a predicate with a business name.
    def has_valid_age(self) -> bool:
        return MIN_AGE <= self.age <= MAX_AGE

    def has_enough_income(self) -> bool:
        if self.has_guarantor:
            return self.monthly_income >= MIN_INCOME_WITH_GUARANTOR
        return self.monthly_income >= MIN_INCOME

    def has_affordable_debt(self) -> bool:
        return self.monthly_debt / max(self.monthly_income, 1) <= MAX_DEBT_RATIO

    def has_clean_history(self) -> bool:
        return self.defaults == 0 or (
            self.defaults == 1 and self.years_since_default >= YEARS_TO_FORGIVE_DEFAULT
        )

    def is_eligible(self) -> bool:
        # REFACTOR: the complete rule reads like a sentence.
        return (
            self.has_valid_age()
            and self.has_enough_income()
            and self.has_affordable_debt()
            and self.has_clean_history()
        )


def is_eligible(applicant: dict[str, Any]) -> bool:
    return Applicant(**applicant).is_eligible()
