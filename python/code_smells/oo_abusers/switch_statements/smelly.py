"""Smelly version: the same if/elif on the employee type is repeated."""

from dataclasses import dataclass


@dataclass
class Employee:
    name: str
    kind: str  # "salaried" | "hourly" | "contractor"
    base: float
    hours: float = 0


def monthly_pay(e: Employee) -> float:
    # SMELL: Switch Statements. First copy of the conditional on `kind`.
    if e.kind == "salaried":
        return e.base / 12
    elif e.kind == "hourly":
        return e.base * e.hours
    elif e.kind == "contractor":
        return e.base * e.hours * 1.1
    raise ValueError(e.kind)


def vacation_days(e: Employee) -> int:
    # SMELL: second copy of the same conditional. Adding a new type
    # (e.g. "intern") forces you to find and change every copy.
    if e.kind == "salaried":
        return 23
    elif e.kind == "hourly":
        return 15
    elif e.kind == "contractor":
        return 0
    raise ValueError(e.kind)


def payslip_title(e: Employee) -> str:
    # SMELL: third copy.
    if e.kind == "salaried":
        return f"Monthly payslip - {e.name}"
    elif e.kind == "hourly":
        return f"Hourly payslip - {e.name}"
    elif e.kind == "contractor":
        return f"Contractor invoice - {e.name}"
    raise ValueError(e.kind)
