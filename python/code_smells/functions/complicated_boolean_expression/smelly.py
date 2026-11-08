"""Smelly version: loan eligibility in a single opaque condition."""


def is_eligible(applicant: dict) -> bool:
    # SMELL: Complicated Boolean Expression. A four-line condition mixes age,
    # income, debt and history. To understand it you must decipher parentheses and
    # precedence; changing one rule risks breaking another.
    return (applicant["age"] >= 18 and applicant["age"] <= 70) and (
        applicant["monthly_income"] >= 1200 or (applicant["has_guarantor"] and
        applicant["monthly_income"] >= 800)) and not (applicant["monthly_debt"] /
        max(applicant["monthly_income"], 1) > 0.35) and (applicant["defaults"] == 0 or
        (applicant["defaults"] == 1 and applicant["years_since_default"] >= 5))
