"""Refactored version: a single source of truth for the net salary calculation."""

# REFACTOR: Extract Function. The brackets are defined once, as data.
IRPF_BRACKETS: tuple[tuple[float, float], ...] = (
    (1500, 0.10),
    (3000, 0.15),
    (float("inf"), 0.22),
)
SOCIAL_SECURITY_RATE = 0.0635


def irpf_rate(gross_monthly: float) -> float:
    return next(rate for limit, rate in IRPF_BRACKETS if gross_monthly <= limit)


def net_salary(gross_monthly: float) -> float:
    deductions = gross_monthly * (irpf_rate(gross_monthly) + SOCIAL_SECURITY_RATE)
    return round(gross_monthly - deductions, 2)


def full_time_net_salary(gross_monthly: float) -> float:
    return net_salary(gross_monthly)


def part_time_net_salary(hourly_rate: float, hours: float) -> float:
    # REFACTOR: the variant only computes its gross amount and reuses the common logic.
    return net_salary(hourly_rate * hours)
