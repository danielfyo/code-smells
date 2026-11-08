"""Monthly payroll calculation for an employee."""

# REFACTOR: Delete Commented-Out Code. All commented code is removed (imports, caps, debug
# traces, dead export functions). If it is ever needed again, `git log -S` brings it back.
# The live code stays short and unambiguous.

INCOME_TAX_RATE = 0.15
SOCIAL_SECURITY_RATE = 0.0635


def net_salary(gross_monthly: float, bonus: float = 0.0) -> float:
    gross = gross_monthly + bonus
    income_tax = gross * INCOME_TAX_RATE
    social_security = gross * SOCIAL_SECURITY_RATE
    return round(gross - income_tax - social_security, 2)
