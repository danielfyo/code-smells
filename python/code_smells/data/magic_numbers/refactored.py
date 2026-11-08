"""Refactored version: each literal has a name that explains its meaning."""

from enum import Enum


# REFACTOR: Replace Magic Literal (with constants and an Enum). The code now says
# what each value means and there is a single place to change it.
class Plan(Enum):
    BASIC = "B"
    PREMIUM = "P"


MONTHLY_PRICE = {Plan.BASIC: 29.9, Plan.PREMIUM: 49.9}
YOUTH_AGE_LIMIT = 26
SENIOR_AGE = 65
AGE_DISCOUNT = 0.20
ANNUAL_COMMITMENT_MONTHS = 12
ANNUAL_DISCOUNT = 0.10


def qualifies_for_age_discount(age: int) -> bool:
    return age < YOUTH_AGE_LIMIT or age >= SENIOR_AGE


def membership_fee(plan: str, age: int, months: int) -> float:
    monthly = MONTHLY_PRICE[Plan(plan)]
    if qualifies_for_age_discount(age):
        monthly *= 1 - AGE_DISCOUNT
    if months >= ANNUAL_COMMITMENT_MONTHS:
        monthly *= 1 - ANNUAL_DISCOUNT
    return round(monthly * months, 2)
