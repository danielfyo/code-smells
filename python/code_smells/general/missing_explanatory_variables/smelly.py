"""Personal loan eligibility (smelly version)."""


# SMELL: Missing Explanatory Variables. A huge condition that is not broken down: you have
# to decipher what each subexpression means (debt ratio? job tenure?) and it is impossible
# to debug which part fails.
def is_eligible(
    age: int, monthly_income: float, monthly_debts: float, years_employed: float, amount: float
) -> bool:
    return (
        18 <= age <= 70
        and (monthly_debts + amount / 60) / monthly_income <= 0.35
        and (years_employed >= 1 or (monthly_income > 3000 and age > 25))
        and amount <= monthly_income * 12 * 0.5
    )
