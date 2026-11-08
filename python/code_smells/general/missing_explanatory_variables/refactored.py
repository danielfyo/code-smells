"""Personal loan eligibility."""

LOAN_TERM_MONTHS = 60
MAX_DEBT_RATIO = 0.35


# REFACTOR: Introduce Explaining Variable. Each subexpression gets a name that explains the
# business rule; the final condition reads like a sentence and each step can be inspected
# in the debugger.
def is_eligible(
    age: int, monthly_income: float, monthly_debts: float, years_employed: float, amount: float
) -> bool:
    is_adult_of_working_age = 18 <= age <= 70

    new_monthly_installment = amount / LOAN_TERM_MONTHS
    debt_ratio = (monthly_debts + new_monthly_installment) / monthly_income
    can_afford_installment = debt_ratio <= MAX_DEBT_RATIO

    has_stable_job = years_employed >= 1
    is_high_earner = monthly_income > 3000 and age > 25
    has_reliable_income = has_stable_job or is_high_earner

    max_amount = monthly_income * 12 * 0.5
    amount_within_limit = amount <= max_amount

    return (
        is_adult_of_working_age
        and can_afford_installment
        and has_reliable_income
        and amount_within_limit
    )
