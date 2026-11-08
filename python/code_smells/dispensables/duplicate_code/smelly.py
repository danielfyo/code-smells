"""Smelly version: the same payroll calculation logic copied in two places."""


def full_time_net_salary(gross_monthly: float) -> float:
    # SMELL: Duplicate Code. The income tax brackets and the social security
    # contribution are copied in the function below.
    if gross_monthly <= 1500:
        irpf = gross_monthly * 0.10
    elif gross_monthly <= 3000:
        irpf = gross_monthly * 0.15
    else:
        irpf = gross_monthly * 0.22
    social_security = gross_monthly * 0.0635
    return round(gross_monthly - irpf - social_security, 2)


def part_time_net_salary(hourly_rate: float, hours: float) -> float:
    gross_monthly = hourly_rate * hours
    # SMELL: ...almost a literal copy. Someone updated the top bracket to 0.22 above,
    # but here it stayed at 0.21: the copies have already diverged (bug).
    if gross_monthly <= 1500:
        irpf = gross_monthly * 0.10
    elif gross_monthly <= 3000:
        irpf = gross_monthly * 0.15
    else:
        irpf = gross_monthly * 0.21
    social_security = gross_monthly * 0.0635
    return round(gross_monthly - irpf - social_security, 2)
